// src/pages/ManageStudents.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import supabase from '../config/index';
import Footer from '../components/Footer';

const ManageStudents = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('userName');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch students from database
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error fetching students: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Handle Excel file upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Processing file...');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelStudents = XLSX.utils.sheet_to_json(worksheet);

      if (excelStudents.length === 0) {
        setUploadStatus('No data found in Excel file!');
        setUploading(false);
        return;
      }

      setUploadStatus(`Found ${excelStudents.length} students. Uploading...`);

      let successCount = 0;
      let errorCount = 0;
      let errorsList = [];

      for (let i = 0; i < excelStudents.length; i++) {
        const student = excelStudents[i];
        
        const studentData = {
          cnic: student['CNIC'] || student['cnic'] || '',
          rollno: student['Roll no'] || student['RollNo'] || student['rollno'] || '',
          full_name: student['Name'] || student['name'] || '',
          email: student['Email'] || student['email'] || '',
          phone: student['Phone'] || student['phone'] || '',
          status: 'active'
        };

        if (!studentData.rollno || !studentData.full_name || !studentData.email || !studentData.cnic) {
          errorCount++;
          errorsList.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        const { error } = await supabase
          .from('students')
          .insert([studentData]);

        if (error) {
          errorCount++;
          errorsList.push(`Row ${i + 2}: ${error.message}`);
        } else {
          successCount++;
        }
      }

      setUploadStatus(`✅ ${successCount} students added, ${errorCount} failed.`);
      
      e.target.value = '';
      fetchStudents(); // Refresh the list

      setTimeout(() => {
        setUploadStatus('');
      }, 5000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  // Delete student
  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.full_name}?`)) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('cnic', student.cnic);

        if (error) throw error;
        
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        alert('Error deleting student: ' + error.message);
      }
    }
  };

  // Update student
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('students')
        .update({
          full_name: editingStudent.full_name,
          email: editingStudent.email,
          phone: editingStudent.phone,
          status: editingStudent.status
        })
        .eq('cnic', editingStudent.cnic);

      if (error) throw error;
      
      alert('Student updated successfully!');
      setShowEditModal(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      alert('Error updating student: ' + error.message);
    }
  };

  // Filter students by search
  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cnic?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-white font-bold text-xl">Manage Students</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">👋 {adminName}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        
        {/* Excel Upload Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">📁 Import Students From Excel</h2>
              <p className="text-gray-600 text-sm">Upload Excel file to add multiple students at once</p>
            </div>
            <div className="flex gap-3">
              <label className={`cursor-pointer px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 shadow-md ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? 'Uploading...' : '📤 Upload Excel'}
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
             
            </div>
          </div>
          {uploadStatus && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${uploadStatus.includes('✅') ? 'bg-green-100 text-green-700' : uploadStatus.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, roll no, email or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No students found. Upload Excel file to add students.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.cnic} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollno}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.cnic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-500">
          Total Students: {filteredStudents.length}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Student</h2>
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                  <input
                    type="text"
                    value={editingStudent.rollno}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingStudent.full_name}
                    onChange={(e) => setEditingStudent({...editingStudent, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingStudent(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageStudents;