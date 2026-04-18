// src/pages/StudentDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const studentRollno = localStorage.getItem('studentRollno');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-white font-bold text-xl">Student Dashboard</h1>
            <div className="hidden md:flex items-center gap-5 ml-6">
              <button 
                onClick={() => navigate('/student/courses')} 
                className="text-gray-300 hover:text-blue-400 transition"
              >
                 Courses
              </button>
              <button 
                onClick={() => navigate('/student/my-leaves')} 
                className="text-gray-300 hover:text-blue-400 transition"
              >
                 My Leaves
              </button>
              <button 
                onClick={() => navigate('/student/apply-leave')} 
                className="text-gray-300 hover:text-blue-400 transition"
              >
                 Apply Leave
              </button>
              <button 
                onClick={() => navigate('/student/my-courses')} 
                className="text-gray-300 hover:text-blue-400 transition"
              >
                 My Courses
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300"> {userName} ({studentRollno})</span>
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
        
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8 border border-blue-200">
          <div className="text-center">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back, {userName}!
            </h1>
            <p className="text-gray-600 mb-4">
              Roll Number: <span className="font-semibold text-blue-600">{studentRollno}</span>
            </p>
            <p className="text-gray-500">
              Manage your courses, submit leave requests, and track your academic journey.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">My Courses</p>
                <p className="text-3xl font-bold text-blue-700">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Leaves Taken</p>
                <p className="text-3xl font-bold text-green-700">0</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium mb-1">Pending Leaves</p>
                <p className="text-3xl font-bold text-yellow-700">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Approved Leaves</p>
                <p className="text-3xl font-bold text-purple-700">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div 
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer" 
            onClick={() => navigate('/student/courses')}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">📚 Browse Courses</h3>
            <p className="text-gray-600 text-sm mb-4">Explore and apply for available courses</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">View Courses →</button>
          </div>
          
          <div 
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer" 
            onClick={() => navigate('/student/apply-leave')}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">✏️ Apply for Leave</h3>
            <p className="text-gray-600 text-sm mb-4">Submit a new leave request</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Apply Now →</button>
          </div>
          
          <div 
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer" 
            onClick={() => navigate('/student/my-leaves')}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">📋 My Leave History</h3>
            <p className="text-gray-600 text-sm mb-4">View all your leave requests and status</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">View History →</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;