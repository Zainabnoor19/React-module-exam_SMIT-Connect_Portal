// src/pages/ManageLeaveRequests.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/index';
import Footer from '../components/Footer';

const ManageLeaveRequests = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('userName');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveRequests(data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      alert('Error fetching leave requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: status })
        .eq('id', id);

      if (error) throw error;
      
      alert(`Leave request ${status} successfully!`);
      fetchLeaveRequests();
      setShowDetailsModal(false);
      setSelectedLeave(null);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

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
      <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-white font-bold text-xl">Manage Leave Requests</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">👋 {adminName}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-6 py-8">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Leave Requests</h2>
          <p className="text-gray-600">Review and manage student leave requests</p>
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
            All ({leaveRequests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'pending' 
                ? 'text-yellow-600 border-b-2 border-yellow-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({leaveRequests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'approved' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({leaveRequests.filter(r => r.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'rejected' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected ({leaveRequests.filter(r => r.status === 'rejected').length})
          </button>
        </div>

        {/* Leave Requests Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading leave requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500">No leave requests found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request, index) => {
                    const startDate = new Date(request.start_date);
                    const endDate = new Date(request.end_date);
                    const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                    
                    return (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.student_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.student_rollno}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{request.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(request.start_date).toLocaleDateString()} <br/>
                          <span className="text-xs">to</span> <br/>
                          {new Date(request.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {diffDays} {diffDays === 1 ? 'day' : 'days'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.attachment_url ? (
                            <a 
                              href={request.attachment_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              📎 View
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">No file</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => {
                              setSelectedLeave(request);
                              setShowDetailsModal(true);
                            }}
                            className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm transition-all duration-200 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{leaveRequests.length}</div>
            <div className="text-sm text-blue-700">Total Requests</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{leaveRequests.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{leaveRequests.filter(r => r.status === 'approved').length}</div>
            <div className="text-sm text-green-700">Approved</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{leaveRequests.filter(r => r.status === 'rejected').length}</div>
            <div className="text-sm text-red-700">Rejected</div>
          </div>
        </div>
      </main>

      {/* Leave Details Modal */}
      {showDetailsModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Leave Request Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedLeave(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Student Name</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedLeave.student_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Roll Number</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedLeave.student_rollno}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Reason for Leave</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{selectedLeave.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(selectedLeave.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(selectedLeave.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Attachment Section in Modal */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Attachment</p>
                {selectedLeave.attachment_url ? (
                  <a 
                    href={selectedLeave.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                  >
                    📎 View Attachment
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No attachment uploaded</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusBadge(selectedLeave.status)}`}>
                  {getStatusText(selectedLeave.status)}
                </span>
              </div>
            </div>

            {selectedLeave.status === 'pending' && (
              <div className="flex gap-3 mt-6 pt-3">
                <button
                  onClick={() => updateLeaveStatus(selectedLeave.id, 'approved')}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => updateLeaveStatus(selectedLeave.id, 'rejected')}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md"
                >
                  ❌ Reject
                </button>
              </div>
            )}

            {selectedLeave.status !== 'pending' && (
              <div className="flex gap-3 mt-6 pt-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedLeave(null);
                  }}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageLeaveRequests;