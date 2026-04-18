// src/auth/AdminLogin.jsx - Make sure role is saved
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../config/index';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('email', formData.email)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== 'admin') {
        throw new Error('Admin privileges required.');
      }

      // Save to localStorage
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', profile.full_name);
      localStorage.setItem('userEmail', formData.email);
      
      console.log('Role saved:', localStorage.getItem('userRole')); // Debug

      alert(`Welcome ${profile.full_name}!`);
      navigate('/admin');

    } catch (error) {
      setError(error.message || 'Login failed');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400 text-sm">SMIT Connect - Administration</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Login</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Enter your credentials to continue</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              placeholder="Admin Email Address"
              required 
            />
          </div>
          
          <div>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
              placeholder="Password"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 shadow-lg shadow-blue-500/25"
          >
            {loading ? 'Authenticating...' : 'ADMIN LOGIN'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">Demo Admin: admin@smit.com | pass: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;