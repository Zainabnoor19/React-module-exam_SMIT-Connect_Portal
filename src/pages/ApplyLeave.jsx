// src/pages/ApplyLeave.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/index';
import Footer from '../components/Footer';

const ApplyLeave = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    reason: '',
    start_date: '',
    end_date: '',
    attachment: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, JPG, or PDF files are allowed');
        return;
      }
      setFormData({ ...formData, attachment: file });
      setAttachmentPreview(URL.createObjectURL(file));
    }
  };

  const uploadAttachment = async () => {
    if (!formData.attachment) return null;
    
    const fileExt = formData.attachment.name.split('.').pop();
    const studentRollno = localStorage.getItem('studentRollno');
    const fileName = `${studentRollno}_${Date.now()}.${fileExt}`;
    const filePath = `leave-attachments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('leave-attachments')
      .upload(filePath, formData.attachment);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('leave-attachments')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Get values from localStorage
    const studentId = localStorage.getItem('studentId');
    const studentRollno = localStorage.getItem('studentRollno');
    const userName = localStorage.getItem('userName');

    console.log('=== ApplyLeave Debug ===');
    console.log('studentId:', studentId);
    console.log('studentRollno:', studentRollno);
    console.log('userName:', userName);
    console.log('========================');

    if (!studentId) {
      setError('Session expired. Please login again.');
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.reason.trim()) {
      setError('Please enter a reason for leave');
      setLoading(false);
      return;
    }
    if (!formData.start_date) {
      setError('Please select start date');
      setLoading(false);
      return;
    }
    if (!formData.end_date) {
      setError('Please select end date');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError('Start date cannot be in the past');
      setLoading(false);
      return;
    }
    if (endDate < startDate) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      // Upload attachment if provided
      let attachmentUrl = null;
      if (formData.attachment) {
        attachmentUrl = await uploadAttachment();
      }

      // Submit leave request
      const { error: submitError } = await supabase
        .from('leave_requests')
        .insert([{
          student_id: studentId,
          student_name: userName,
          student_rollno: studentRollno,
          reason: formData.reason,
          start_date: formData.start_date,
          end_date: formData.end_date,
          attachment_url: attachmentUrl,
          status: 'pending'
        }]);

      if (submitError) {
        console.error('Submit error details:', submitError);
        throw submitError;
      }

      setSuccess('Leave request submitted successfully!');
      setFormData({
        reason: '',
        start_date: '',
        end_date: '',
        attachment: null
      });
      setAttachmentPreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('attachment');
      if (fileInput) fileInput.value = '';

      setTimeout(() => {
        navigate('/student/my-leaves');
      }, 2000);

    } catch (error) {
      console.error('Submit error:', error);
      setError(error.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/student')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-white font-bold text-xl">Apply for Leave</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300"> {localStorage.getItem('userName')}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-6 py-8 max-w-2xl">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Submit Leave Request</h2>
          <p className="text-gray-600">Please fill out the form below to request leave</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {success}
              </div>
            )}

            {/* Reason for Leave */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Leave <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                placeholder="Please describe the reason for your leave..."
                required
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Attachment Upload - Optional */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attachment (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all">
                <input
                  type="file"
                  id="attachment"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="attachment"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {formData.attachment ? formData.attachment.name : 'Upload medical certificate or supporting document (Optional)'}
                  </span>
                  <span className="text-xs text-gray-400">
                    JPEG, PNG, JPG, or PDF (Max 5MB)
                  </span>
                </label>
              </div>
              {attachmentPreview && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <img src={attachmentPreview} alt="Preview" className="h-20 w-auto rounded" />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Leave Request'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/student')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Note:</span> Your leave request will be reviewed by the admin. 
            You will be notified once it's approved or rejected.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplyLeave;