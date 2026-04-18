// src/components/CourseCard.jsx
import React, { useState, useEffect } from 'react';
import supabase from '../config/index';
import ApplyCourseModal from './ApplyCourseModal';

const CourseCard = ({ course, onEdit, onToggleStatus, onDelete, onApply, isStudentView = false }) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (isStudentView && studentId) {
      checkIfApplied();
    }
  }, []);

  const checkIfApplied = async () => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .select('id')
        .eq('student_id', studentId)
        .eq('course_id', course.id)
        .maybeSingle();
      
      setHasApplied(!!data);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const handleApplySubmit = async (formData) => {
    try {
      const { error } = await supabase
        .from('admissions')
        .insert([{
          student_id: studentId,
          course_id: course.id,
          student_name: formData.full_name,
          student_rollno: formData.rollno,
          student_email: formData.email,
          student_phone: formData.phone,
          student_address: formData.address,
          status: 'pending'
        }]);

      if (error) throw error;
      
      alert(`Successfully applied for ${course.course_name}!`);
      setShowApplyModal(false);
      checkIfApplied();
      
      if (onApply) onApply(course);
    } catch (error) {
      alert('Error applying for course: ' + error.message);
    }
  };

  const isOpen = course.status === 'open';

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Status Badge - Top Bar */}
        <div className={`px-4 py-2 text-sm font-medium ${
          isOpen 
            ? 'bg-green-50 text-green-700 border-b border-green-100' 
            : 'bg-red-50 text-red-700 border-b border-red-100'
        }`}>
          {isOpen ? '🟢 Admissions Open' : '🔴 Admissions Closed'}
        </div>
        
        {/* Course Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{course.course_name}</h3>
              <p className="text-sm text-blue-600 font-medium">{course.course_code}</p>
            </div>
            <span className="text-lg font-bold text-blue-600">Rs {course.fee?.toLocaleString()}</span>
          </div>
          
          <p className="text-gray-600 text-sm mt-2 mb-3">{course.description || 'No description available'}</p>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>⏱️ {course.duration || 'Not specified'}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {isStudentView ? (
              // Student View - Apply Button
              hasApplied ? (
                <button
                  disabled
                  className="w-full px-3 py-1.5 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  ✅ Already Applied
                </button>
              ) : isOpen ? (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-sm transition-all duration-200 font-medium"
                >
                  Apply Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-3 py-1.5 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                >
                  Admissions Closed
                </button>
              )
            ) : (
              // Admin View - Edit, Open/Close, Delete buttons
              <>
                <button
                  onClick={() => onEdit(course)}
                  className="flex-1 px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm transition-all duration-200 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(course)}
                  className={`flex-1 px-3 py-1.5 border rounded-lg text-sm transition-all duration-200 font-medium ${
                    isOpen 
                      ? 'border-gray-500 text-gray-600 hover:bg-gray-50' 
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isOpen ? 'Close' : 'Open'}
                </button>
                <button
                  onClick={() => onDelete(course)}
                  className="flex-1 px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyCourseModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplySubmit}
        course={course}
      />
    </>
  );
};

export default CourseCard;