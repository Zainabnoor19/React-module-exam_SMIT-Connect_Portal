import React, { useState, useEffect } from 'react';

const CourseModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    duration: '',
    fee: '',
    status: 'open'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        course_code: initialData.course_code || '',
        course_name: initialData.course_name || '',
        description: initialData.description || '',
        duration: initialData.duration || '',
        fee: initialData.fee || '',
        status: initialData.status || 'open'
      });
    } else {
      setFormData({
        course_code: '',
        course_name: '',
        description: '',
        duration: '',
        fee: '',
        status: 'open'
      });
    }
  }, [initialData, isOpen]);

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

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          {title}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Input style common */}
          {/* Course Code */}
          <input
            type="text"
            name="course_code"
            value={formData.course_code}
            onChange={handleChange}
            disabled={initialData?.course_code}
            placeholder="Course Code (e.g. WD-101)"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                       hover:border-cyan-300 transition"
            required
          />

          {/* Course Name */}
          <input
            type="text"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            placeholder="Course Name"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                       hover:border-cyan-300 transition"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                       hover:border-cyan-300 transition"
          />

          {/* Duration + Fee */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Duration"
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                         focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                         hover:border-cyan-300 transition"
            />

            <input
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              placeholder="Fee"
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                         focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                         hover:border-cyan-300 transition"
            />
          </div>

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl 
                       focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 
                       hover:border-cyan-300 transition bg-white"
          >
            <option value="open">🟢 Open</option>
            <option value="closed">🔴 Closed</option>
          </select>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 
                         hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl 
                         font-semibold shadow-md hover:shadow-lg transition"
            >
              {initialData ? 'Update' : 'Add Course'}
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

export default CourseModal;