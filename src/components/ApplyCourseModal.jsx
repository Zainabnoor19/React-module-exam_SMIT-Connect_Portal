import React, { useState } from 'react';

const ApplyCourseModal = ({ isOpen, onClose, onSubmit, course }) => {
  const [formData, setFormData] = useState({
    full_name: localStorage.getItem('userName') || '',
    rollno: localStorage.getItem('studentRollno') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-gray-200 animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Apply for {course?.course_name}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            readOnly
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                       bg-gray-100"
          />

          {/* Roll No */}
          <input
            type="text"
            name="rollno"
            value={formData.rollno}
            readOnly
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                       hover:border-cyan-300 transition"
          />

          {/* Address */}
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows="2"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                       hover:border-cyan-300 transition resize-none"
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-3">

            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 
                         hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl 
                         font-semibold shadow-md hover:shadow-lg transition"
            >
              Submit Application
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 
                         hover:bg-gray-50 rounded-xl font-semibold transition"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ApplyCourseModal;