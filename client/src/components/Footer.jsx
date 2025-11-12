import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5">
      <div className="container">
        <div className="row">

          {/* About Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">About Library System</h5>
            <p>
              Our Library Management System helps students and teachers efficiently manage library resources,
              browse books, upload study materials, and stay updated with library activities.
              Designed to make academic life easier and organized.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/student" className="text-white text-decoration-none">Student Dashboard</a></li>
              <li><a href="/teacher" className="text-white text-decoration-none">Teacher Dashboard</a></li>
              <li><a href="/books" className="text-white text-decoration-none">Books</a></li>
              <li><a href="/materials" className="text-white text-decoration-none">Study Materials</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <p><i className="bi bi-geo-alt-fill me-2"></i>123 College Street, City, Country</p>
            <p><i className="bi bi-telephone-fill me-2"></i>+91 9876543210</p>
            <p><i className="bi bi-envelope-fill me-2"></i>library@college.edu</p>
          </div>

          {/* Social Media */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="text-white text-decoration-none"><i className="bi bi-facebook me-2"></i>Facebook</a>
              <a href="#" className="text-white text-decoration-none"><i className="bi bi-twitter me-2"></i>Twitter</a>
              <a href="#" className="text-white text-decoration-none"><i className="bi bi-instagram me-2"></i>Instagram</a>
              <a href="#" className="text-white text-decoration-none"><i className="bi bi-linkedin me-2"></i>LinkedIn</a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          &copy; {new Date().getFullYear()} College Library. All rights reserved.
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          footer a:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
