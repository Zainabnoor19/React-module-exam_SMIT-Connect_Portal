// src/pages/ManageAdmissions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/index';
import Footer from '../components/Footer';

const ManageAdmissions = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('userName');
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch admissions with course details
  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select(`
          *,
          courses (
            course_name,
            course_code,
            duration,
            fee,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmissions(data || []);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      alert('Error fetching course applications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Update admission status
  const updateAdmissionStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('admissions')
        .update({ status: status })
        .eq('id', id);

      if (error) throw error;
      
      alert(`Application ${status} successfully!`);
      fetchAdmissions();
      setShowDetailsModal(false);
      setSelectedAdmission(null);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  // Filter admissions
  const filteredAdmissions = admissions.filter(admission => {
    if (filter === 'all') return true;
    return admission.status === filter;
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
              onClick={() => navigate('/admin')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-white font-bold text-xl">Manage Course Applications</h1>
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Course Applications</h2>
          <p className="text-gray-600">Review and manage student course applications</p>
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
            All ({admissions.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'pending' 
                ? 'text-yellow-600 border-b-2 border-yellow-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({admissions.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'approved' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({admissions.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
              filter === 'rejected' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected ({admissions.filter(a => a.status === 'rejected').length})
          </button>
        </div>

        {/* Admissions Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading applications...</div>
        ) : filteredAdmissions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500">No course applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmissions.map((admission, index) => (
                    <tr key={admission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{admission.student_name}</div>
                        <div className="text-xs text-gray-500">{admission.student_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admission.student_rollno}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{admission.courses?.course_name}</div>
                        <div className="text-xs text-gray-500">{admission.courses?.course_code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(admission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(admission.status)}`}>
                          {getStatusText(admission.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAdmission(admission);
                            setShowDetailsModal(true);
                          }}
                          className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm transition-all duration-200 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{admissions.length}</div>
            <div className="text-sm text-blue-700">Total Applications</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{admissions.filter(a => a.status === 'pending').length}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{admissions.filter(a => a.status === 'approved').length}</div>
            <div className="text-sm text-green-700">Approved</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{admissions.filter(a => a.status === 'rejected').length}</div>
            <div className="text-sm text-red-700">Rejected</div>
          </div>
        </div>
      </main>

      {/* Application Details Modal */}
      {showDetailsModal && selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAdmission(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Student Name</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAdmission.student_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Roll Number</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAdmission.student_rollno}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Course Applied For</p>
                <p className="text-sm font-semibold text-gray-900">{selectedAdmission.courses?.course_name}</p>
                <p className="text-xs text-gray-500">{selectedAdmission.courses?.course_code}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-sm text-gray-700">{selectedAdmission.courses?.duration || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Fee</p>
                  <p className="text-sm font-semibold text-blue-600">Rs {selectedAdmission.courses?.fee?.toLocaleString()}</p>
                </div>
              </div>

              {selectedAdmission.student_phone && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="text-sm text-gray-700">{selectedAdmission.student_phone}</p>
                </div>
              )}

              {selectedAdmission.student_address && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm text-gray-700">{selectedAdmission.student_address}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Application Status</p>
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusBadge(selectedAdmission.status)}`}>
                  {getStatusText(selectedAdmission.status)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedAdmission.status === 'pending' && (
              <div className="flex gap-3 mt-6 pt-3">
                <button
                  onClick={() => updateAdmissionStatus(selectedAdmission.id, 'approved')}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => updateAdmissionStatus(selectedAdmission.id, 'rejected')}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md"
                >
                  ❌ Reject
                </button>
              </div>
            )}

            {selectedAdmission.status !== 'pending' && (
              <div className="flex gap-3 mt-6 pt-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAdmission(null);
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

export default ManageAdmissions;