// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Service from "./pages/Service";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminBooks from "./pages/admin/AdminBooks";
import TeacherManagement from "./pages/admin/TeacherManagement";
import IssueLogs from "./pages/admin/IssueLogs";
import StudentProfile from "./pages/student/StudentProfile";
import PayFinePage from "./pages/student/PayFinePage";
import TecherProfile from "./pages/teacher/TeacherProfile";
import StudentMaterials from "./pages/student/StudentMaterials";

// Common Components
import Navbar from "./components/Navbar";

// Auth Context
import { AuthProvider, useAuth } from "./store/auth";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// ✅ ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    // User login nahi hai ya role match nahi karta → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Common Navbar sabhi pages me dikhana hai */}
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service" element={<Service />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/library" element={<AdminBooks />} />
          <Route path="/teachers" element={<TeacherManagement />} />
          <Route path="/admin/issuebooks" element={<IssueLogs />} />
          <Route path="/profile" element={<StudentProfile />} />
           <Route path="/records" element={<PayFinePage />} />
           <Route path="/teacherprofile" element={<TecherProfile/>} />
           <Route path="/studentmaterials" element={<StudentMaterials/>} />
           
          {/* Admin Protected Route */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Student Protected Route */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Teacher Protected Route */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route (404 redirect to home) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
