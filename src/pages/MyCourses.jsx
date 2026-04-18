// src/pages/MyCourses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/index';
import Footer from '../components/Footer';

const MyCourses = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const studentId = localStorage.getItem('studentId');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch student's course applications
  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select(`
          *,
          courses (
            course_name,
            course_code,
            description,
            duration,
            fee,
            status
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Error fetching your courses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  // Get status badge style
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return '⏳ Pending';
      case 'approved':
        return '✅ Approved';
      case 'rejected':
        return '❌ Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/student')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-white font-bold text-xl">My Courses</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300"> {userName}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Course Applications</h2>
          <p className="text-gray-600">View all your course applications and their status</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'pending' 
                ? 'text-yellow-600 border-b-2 border-yellow-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'approved' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({applications.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'rejected' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading your courses...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500">No course applications found</p>
            <button
              onClick={() => navigate('/student/courses')}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900">
                      {application.courses?.course_name || 'Course'}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">{application.courses?.course_code}</p>
                    
                    <p className="text-gray-600 text-sm mt-2">
                      {application.courses?.description || 'No description available'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <span>⏱️ {application.courses?.duration || 'Not specified'}</span>
                      <span>💰 Rs {application.courses?.fee?.toLocaleString()}</span>
                    </div>

                    {application.student_phone && (
                      <p className="text-sm text-gray-500 mt-2">📞 {application.student_phone}</p>
                    )}
                    {application.student_address && (
                      <p className="text-sm text-gray-500">📍 {application.student_address}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{applications.filter(a => a.status === 'pending').length}</div>
            <div className="text-sm text-yellow-700">Pending Applications</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{applications.filter(a => a.status === 'approved').length}</div>
            <div className="text-sm text-green-700">Approved Applications</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</div>
            <div className="text-sm text-red-700">Rejected Applications</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyCourses;