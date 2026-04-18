// src/pages/AdminDashboard.jsx - Complete fixed version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import supabase from '../config/index';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('userName');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    pendingLeaves: 0,
    activeAdmissions: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      const { count: pendingLeavesCount } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: activeCoursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      setStats({
        totalStudents: studentsCount || 0,
        totalCourses: coursesCount || 0,
        pendingLeaves: pendingLeavesCount || 0,
        activeAdmissions: activeCoursesCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Processing file...');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const students = XLSX.utils.sheet_to_json(worksheet);

      if (students.length === 0) {
        setUploadStatus('No data found!');
        setUploading(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      let errorsList = [];

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        
        const studentData = {
          rollno: student['Roll no'] || '',
          full_name: student['Name'] || '',
          email: student['Email'] || '',
          cnic: student['CNIC'] || ''
        };

        if (!studentData.rollno || !studentData.full_name || !studentData.email || !studentData.cnic) {
          errorCount++;
          errorsList.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        // Check if student already exists in students table
        const { data: existing } = await supabase
          .from('students')
          .select('cnic')
          .eq('cnic', studentData.cnic)
          .maybeSingle();

        if (existing) {
          errorCount++;
          errorsList.push(`Row ${i + 2}: Student already exists (${studentData.rollno})`);
          continue;
        }

        // Insert into students table
        const { error: insertError } = await supabase
          .from('students')
          .insert([studentData]);

        if (insertError) {
          errorCount++;
          errorsList.push(`Row ${i + 2}: ${insertError.message}`);
          continue;
        }

        // Create auth user for student (ignore if already exists)
        const { error: authError } = await supabase.auth.signUp({
          email: studentData.email,
          password: studentData.rollno,
          options: {
            data: {
              full_name: studentData.full_name,
              role: 'student'
            }
          }
        });

        // Only show error if it's NOT "User already registered"
        if (authError && authError.message !== 'User already registered') {
          errorCount++;
          errorsList.push(`Row ${i + 2}: Auth error - ${authError.message}`);
          continue;
        }
        
        successCount++;
      }

      if (errorsList.length > 0 && errorsList.length < 10) {
        setUploadStatus(`✅ ${successCount} added, ${errorCount} failed.\n\nErrors:\n${errorsList.join('\n')}`);
      } else if (errorsList.length >= 10) {
        setUploadStatus(`✅ ${successCount} added, ${errorCount} failed.\n\nToo many errors. Check console.`);
      } else {
        setUploadStatus(`✅ ${successCount} students added successfully! They can now login with password = Roll No.`);
      }
      
      e.target.value = '';
      fetchStats();
      
      setTimeout(() => setUploadStatus(''), 8000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-white font-bold text-xl">Admin Dashboard</h1>
            <div className="hidden md:flex items-center gap-5 ml-6">
              <button onClick={() => navigate('/admin/manage-students')} className="text-gray-300 hover:text-blue-400 transition">
                Students
              </button>
              <button onClick={() => navigate('/admin/manage-courses')} className="text-gray-300 hover:text-blue-400 transition">
                Courses
              </button>
              <button onClick={() => navigate('/admin/manage-leaves')} className="text-gray-300 hover:text-blue-400 transition">
                Leaves
              </button>
              <button onClick={() => navigate('/admin/manage-admissions')} className="text-gray-300 hover:text-blue-400 transition">
                Applications
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">👋 {adminName}</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">📁 Import Students From Excel</h2>
              <p className="text-gray-600 text-sm">Upload Excel file to add multiple students (Password = Roll No)</p>
            </div>
            <label className={`cursor-pointer px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg ${uploading ? 'opacity-50' : ''}`}>
              {uploading ? 'Uploading...' : '📤 Upload Excel'}
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
          {uploadStatus && <div className="mt-3 p-2 text-sm whitespace-pre-wrap">{uploadStatus}</div>}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Total Students</p>
                {loadingStats ? <div className="h-8 w-16 bg-blue-200 animate-pulse rounded"></div> : <p className="text-3xl font-bold text-blue-700">{stats.totalStudents}</p>}
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-600 font-medium mb-1">Total Courses</p>
                {loadingStats ? <div className="h-8 w-16 bg-cyan-200 animate-pulse rounded"></div> : <p className="text-3xl font-bold text-cyan-700">{stats.totalCourses}</p>}
              </div>
              <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium mb-1">Pending Leaves</p>
                {loadingStats ? <div className="h-8 w-16 bg-yellow-200 animate-pulse rounded"></div> : <p className="text-3xl font-bold text-yellow-700">{stats.pendingLeaves}</p>}
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Open Courses</p>
                {loadingStats ? <div className="h-8 w-16 bg-green-200 animate-pulse rounded"></div> : <p className="text-3xl font-bold text-green-700">{stats.activeAdmissions}</p>}
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/admin/manage-students')}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">📊 Manage Students</h3>
            <p className="text-gray-600 text-sm mb-4">View, edit, or delete student records</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Manage →</button>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/admin/manage-courses')}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">📚 Manage Courses</h3>
            <p className="text-gray-600 text-sm mb-4">Add, edit, or close course admissions</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Manage →</button>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/admin/manage-leaves')}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">📋 Leave Requests</h3>
            <p className="text-gray-600 text-sm mb-4">Approve or reject student leave requests</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Manage →</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;