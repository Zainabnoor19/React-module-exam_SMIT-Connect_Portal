// src/pages/MyLeaves.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/index';
import Footer from '../components/Footer';

const MyLeaves = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const studentId = localStorage.getItem('studentId');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch student's leave requests
  const fetchMyLeaves = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaves(data || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      alert('Error fetching leave requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Filter leaves based on status
  const filteredLeaves = leaves.filter(leave => {
    if (filter === 'all') return true;
    return leave.status === filter;
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

  // Get status text
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
            <h1 className="text-white font-bold text-xl">My Leave Requests</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">My Leave History</h2>
          <p className="text-gray-600">View all your leave requests and their status</p>
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
            All ({leaves.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'pending' 
                ? 'text-yellow-600 border-b-2 border-yellow-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({leaves.filter(l => l.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'approved' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({leaves.filter(l => l.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'rejected' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected ({leaves.filter(l => l.status === 'rejected').length})
          </button>
        </div>

        {/* Leave Requests List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading leave requests...</div>
        ) : filteredLeaves.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500">No leave requests found</p>
            <button
              onClick={() => navigate('/student/apply-leave')}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Apply for Leave
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeaves.map((leave) => {
              const startDate = new Date(leave.start_date);
              const endDate = new Date(leave.end_date);
              const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

              return (
                <div key={leave.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
                          {getStatusText(leave.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Applied: {new Date(leave.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{leave.reason}</h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>📅 {new Date(leave.start_date).toLocaleDateString()} → {new Date(leave.end_date).toLocaleDateString()}</span>
                        <span>⏱️ {diffDays} {diffDays === 1 ? 'day' : 'days'}</span>
                      </div>
                      {leave.attachment_url && (
                        <a 
                          href={leave.attachment_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                        >
                          📎 View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Admin Remarks if any */}
                  {leave.admin_remarks && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium text-gray-700">Admin Remarks:</span>
                      <p className="text-gray-600 mt-1">{leave.admin_remarks}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{leaves.filter(l => l.status === 'pending').length}</div>
            <div className="text-sm text-yellow-700">Pending Requests</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{leaves.filter(l => l.status === 'approved').length}</div>
            <div className="text-sm text-green-700">Approved Requests</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{leaves.filter(l => l.status === 'rejected').length}</div>
            <div className="text-sm text-red-700">Rejected Requests</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyLeaves;