// src/routing/Routing.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/HomePage";
import StudentLogin from "../auth/StudentLogin";
import AdminLogin from "../auth/AdminLogin";
import StudentDashboard from "../pages/StudentDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ManageStudents from "../pages/ManageStudents";
import ManageCourses from "../pages/ManageCourses";
import ManageLeaveRequests from "../pages/ManageLeaveRequests";
import StudentCourses from "../pages/StudentCourses";
import ApplyLeave from "../pages/ApplyLeave";
import MyLeaves from "../pages/MyLeaves";
import MyCourses from "../pages/MyCourses";
import ManageAdmissions from "../pages/ManageAdmissions";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Protected Routes - Student */}
        <Route path="/student" element={<StudentDashboard />} />
        
        {/* Protected Routes - Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/manage-students" element={<ManageStudents />} />
        <Route path="/admin/manage-courses" element={<ManageCourses />} />
        <Route path="/admin/manage-leaves" element={<ManageLeaveRequests />} />

        <Route path="/student/courses" element={<StudentCourses />} />
        <Route path="/student/apply-leave" element={<ApplyLeave />} />
        <Route path="/student/my-leaves" element={<MyLeaves />} />
        <Route path="/student/my-courses" element={<MyCourses />} />
        <Route path="/admin/manage-admissions" element={<ManageAdmissions />} />

      </Routes>
    </BrowserRouter>
  );
};

export default Routing;