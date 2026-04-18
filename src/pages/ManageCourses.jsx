// src/pages/ManageCourses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/index';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';

const ManageCourses = ({ isStudentView = false }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch courses from database
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (!isStudentView) alert('Error fetching courses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Add new course (only for admin)
  const handleAddCourse = async (formData) => {
    try {
      const { error } = await supabase
        .from('courses')
        .insert([{
          course_code: formData.course_code,
          course_name: formData.course_name,
          description: formData.description,
          duration: formData.duration,
          fee: parseFloat(formData.fee),
          status: formData.status
        }]);

      if (error) throw error;
      
      alert('Course added successfully!');
      setShowAddModal(false);
      fetchCourses();
    } catch (error) {
      alert('Error adding course: ' + error.message);
    }
  };

  // Update course (only for admin)
  const handleUpdateCourse = async (formData) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          course_name: formData.course_name,
          description: formData.description,
          duration: formData.duration,
          fee: formData.fee,
          status: formData.status
        })
        .eq('id', editingCourse.id);

      if (error) throw error;
      
      alert('Course updated successfully!');
      setShowEditModal(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      alert('Error updating course: ' + error.message);
    }
  };

  // Delete course (only for admin)
  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.course_name}?`)) {
      try {
        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', course.id);

        if (error) throw error;
        
        alert('Course deleted successfully!');
        fetchCourses();
      } catch (error) {
        alert('Error deleting course: ' + error.message);
      }
    }
  };

  // Toggle course status (only for admin)
  const handleToggleStatus = async (course) => {
    const newStatus = course.status === 'open' ? 'closed' : 'open';
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', course.id);

      if (error) throw error;
      
      fetchCourses();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  // For student view - apply for course
  const handleApplyCourse = async (course) => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      alert('Please login again');
      return;
    }

    try {
      const { error } = await supabase
        .from('admissions')
        .insert([{
          student_id: studentId,
          course_id: course.id,
          student_name: localStorage.getItem('userName'),
          student_rollno: localStorage.getItem('studentRollno'),
          student_email: localStorage.getItem('userEmail'),
          status: 'pending'
        }]);

      if (error) throw error;
      
      alert(`Successfully applied for ${course.course_name}!`);
      fetchCourses();
    } catch (error) {
      alert('Error applying for course: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(isStudentView ? '/student' : '/admin')}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-white font-bold text-xl">
              {isStudentView ? 'Available Courses' : 'Manage Courses'}
            </h1>
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
        
        {/* Header with Add Button - Only for Admin */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isStudentView ? 'Browse Courses' : 'Course Management'}
            </h2>
            <p className="text-gray-600">
              {isStudentView 
                ? 'Browse and apply for available courses' 
                : 'Manage your courses, add new courses, or update existing ones'}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Course Applications Button - Only for Admin - FIXED COLOR */}
            {!isStudentView && (
              <button
                onClick={() => navigate('/admin/manage-admissions')}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg shadow-md flex items-center gap-2 transition-all duration-200"
              >
                📋 View Applications
              </button>
            )}
            {/* Add New Course Button - Only for Admin */}
            {!isStudentView && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg shadow-md flex items-center gap-2 transition-all duration-200"
              >
                ➕ Add New Course
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isStudentView={isStudentView}
                onEdit={!isStudentView ? (course) => {
                  setEditingCourse(course);
                  setShowEditModal(true);
                } : null}
                onToggleStatus={!isStudentView ? handleToggleStatus : null}
                onDelete={!isStudentView ? handleDeleteCourse : null}
                onApply={isStudentView ? handleApplyCourse : null}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Course Modal - Only for Admin */}
      {!isStudentView && (
        <>
          <CourseModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddCourse}
            title="Add New Course"
          />

          {/* Edit Course Modal */}
          <CourseModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingCourse(null);
            }}
            onSubmit={handleUpdateCourse}
            initialData={editingCourse}
            title="Edit Course"
          />
        </>
      )}

      <Footer />
    </div>
  );
};

export default ManageCourses;