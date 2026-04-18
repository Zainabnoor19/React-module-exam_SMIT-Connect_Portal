// src/auth/StudentLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/index';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cnic: '',
    email: '',
    rollno: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'cnic') {
      value = value.replace(/-/g, '');
    }
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanCnic = formData.cnic.replace(/-/g, '');

      // STEP 1: Check student in database
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('cnic', cleanCnic)
        .eq('email', formData.email)
        .eq('rollno', formData.rollno)
        .eq('full_name', formData.name)
        .single();

      if (studentError || !student) {
        throw new Error('Student not found. Please check your details.');
      }

      console.log('Student found:', student);
      console.log('Student ID:', student.id);

      // STEP 2: Try login with email and rollno as password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.rollno
      });

      if (authError) {
        console.error('Auth error details:', authError);
        
        if (authError.message === 'Invalid login credentials') {
          const { error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.rollno,
            options: {
              data: {
                full_name: formData.name,
                role: 'student'
              }
            }
          });
          
          if (signUpError && signUpError.message !== 'User already registered') {
            throw new Error('Unable to create account. Please contact admin.');
          }
          
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.rollno
          });
          
          if (retryError) {
            throw new Error('Invalid credentials. Please contact admin to reset password.');
          }
        } else {
          throw new Error(authError.message);
        }
      }

      // STEP 3: Save to localStorage (CRITICAL - Save studentId)
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userName', student.full_name);
      localStorage.setItem('userEmail', student.email);
      localStorage.setItem('studentRollno', student.rollno);
      localStorage.setItem('studentCnic', cleanCnic);
      localStorage.setItem('studentId', student.id);  // ✅ MUST HAVE THIS LINE

      // Debug: Verify saved data
      console.log('=== LocalStorage after login ===');
      console.log('studentId:', localStorage.getItem('studentId'));
      console.log('studentRollno:', localStorage.getItem('studentRollno'));
      console.log('userName:', localStorage.getItem('userName'));
      console.log('userEmail:', localStorage.getItem('userEmail'));
      console.log('================================');

      alert(`Welcome, ${student.full_name}!`);
      navigate('/student');

    } catch (error) {
      setError(error.message || 'Student login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 font-sans">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
        
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
          <p className="text-gray-400 text-sm">SMIT Connect - Student Access</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Student Login</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Enter your credentials to continue</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleStudentLogin} className="space-y-5">
          <div>
            <input 
              type="text" 
              name="cnic" 
              value={formData.cnic} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              placeholder="CNIC (without dashes, e.g., 4240156378901)"
              required 
            />
            <p className="text-xs text-gray-500 mt-1">Enter CNIC without dashes (-)</p>
          </div>
          
          <div>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              placeholder="Email Address e.g. zara@gmail.com"
              required 
            />
          </div>

          <div>
            <input 
              type="text" 
              name="rollno" 
              value={formData.rollno} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              placeholder="Roll Number e.g. SMIT-2601"
              required 
            />
            <p className="text-xs text-gray-500 mt-1">Your password is your Roll Number</p>
          </div>

          <div>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              placeholder="Full Name e.g. Zara"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-blue-500/25"
          >
            {loading ? 'Verifying...' : 'STUDENT LOGIN'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">Note: Only students added by admin can login</p>
          <p className="text-xs text-gray-600 mt-1">Password = Roll Number</p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;