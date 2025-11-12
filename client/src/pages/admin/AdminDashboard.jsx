// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";  // ✅ Outlet import
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-container d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-light p-3 vh-100">
        <h4 className="text-primary fw-bold mb-4"> Library Admin</h4>
        <ul className="list-unstyled">
          <li className="sidebar-item active">
            <i className="bi bi-house-door-fill me-2"></i> Home
          </li>
          <li className="sidebar-item">
            <i className="bi bi-people-fill me-2"></i> Students
          </li>
          <li className="sidebar-item">
          <Link to="/teachers" className="text-decoration-none text-dark">
          <i className="bi bi-person-video3 me-2"></i> Teachers
          </Link>
          </li>
          <li className="sidebar-item">
            <i className="bi bi-person-hearts me-2"></i> Parents
          </li>
          <li className="sidebar-item">
            <i className="bi bi-book-half me-2"></i> Subjects
          </li>
          <li className="sidebar-item">
          <Link to="/admin/issuebooks" className="text-decoration-none text-dark">
          <i className="bi bi-layers-fill me-2"></i> Issue Books
          </Link>
          </li>

          <li className="sidebar-item">
            <i className="bi bi-building me-2"></i> Class
          </li>
          <li className="sidebar-item">
            <i className="bi bi-clipboard2-check-fill me-2"></i> Exams
          </li>
          <li className="sidebar-item">
            <i className="bi bi-calendar-check-fill me-2"></i> Attendance
          </li>
          <li className="sidebar-item">
            <i className="bi bi-cash-coin me-2"></i> Payments{" "}
            <span className="badge bg-danger">7</span>
          </li>
          <li className="sidebar-item">
            <i className="bi bi-chat-dots-fill me-2"></i> Messages
          </li>
          <li className="sidebar-item">
            <i className="bi bi-calculator-fill me-2"></i> Accounting
          </li>
          <li className="sidebar-item">
            <i className="bi bi-bus-front-fill me-2"></i> Transport
          </li>

          {/* ✅ Library link */}
          <li className="sidebar-item">
            <Link to="/library" className="text-decoration-none text-dark">
              <i className="bi bi-journal-bookmark-fill me-2"></i> Library
            </Link>
          </li>

          <li className="sidebar-item">
            <i className="bi bi-gear-fill me-2"></i> Configuration
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* ✅ Yaha AdminBooks (Library page) render hoga */}
        <Outlet />

        {/* Dashboard Stats (default content) */}
        <div className="row g-3 mt-3">
          <div className="col-md-3">
            <div className="stat-card bg-danger text-white p-3 rounded d-flex align-items-center">
              <i className="bi bi-people-fill fs-1 me-3"></i>
              <div>
                <h4>3</h4>
                <p>Total Students</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-success text-white p-3 rounded d-flex align-items-center">
              <i className="bi bi-person-video3 fs-1 me-3"></i>
              <div>
                <h4>3</h4>
                <p>Total Teachers</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-info text-white p-3 rounded d-flex align-items-center">
              <i className="bi bi-person-hearts fs-1 me-3"></i>
              <div>
                <h4>1</h4>
                <p>Total Parents</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card bg-secondary text-white p-3 rounded d-flex align-items-center">
              <i className="bi bi-check2-square fs-1 me-3"></i>
              <div>
                <h4>0</h4>
                <p>Today Present</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-4">
          <h5 className="mb-3">Quick Access</h5>
          <div className="row g-3">
            {[
              { icon: "bi-people-fill", label: "Students" },
              { icon: "bi-person-video3", label: "Teachers" },
              { icon: "bi-person-hearts", label: "Parents" },
              { icon: "bi-building", label: "Class" },
              { icon: "bi-calendar-check-fill", label: "Attendance" },
              { icon: "bi-clipboard2-check-fill", label: "Exams" },
              { icon: "bi-calculator-fill", label: "Accounting" },
              { icon: "bi-journal-bookmark-fill", label: "Library", link: "/library" }, // ✅ Clickable
              { icon: "bi-bus-front-fill", label: "Transport" },
            ].map((item, index) => (
              <div className="col-md-3" key={index}>
                {item.link ? (
                  <Link to={item.link} className="text-decoration-none">
                    <div className="quick-card text-center p-3 border rounded shadow-sm">
                      <i className={`bi ${item.icon} fs-1 text-primary`}></i>
                      <p className="mt-2 mb-0">{item.label}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="quick-card text-center p-3 border rounded shadow-sm">
                    <i className={`bi ${item.icon} fs-1 text-primary`}></i>
                    <p className="mt-2 mb-0">{item.label}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
