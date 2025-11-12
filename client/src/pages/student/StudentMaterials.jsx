// src/pages/student/StudentMaterials.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_BASE = "http://localhost:5000";

const StudentMaterials = () => {
  const [materialsList, setMaterialsList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/study-material`);
      setMaterialsList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMaterials = materialsList.filter(
    m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.teacherUsername.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (url) => {
    const ext = url.split(".").pop();
    switch (ext) {
      case "pdf": return "bi-file-earmark-pdf";
      case "doc":
      case "docx": return "bi-file-earmark-word";
      case "ppt":
      case "pptx": return "bi-file-earmark-ppt";
      case "jpg":
      case "jpeg":
      case "png": return "bi-file-image";
      default: return "bi-file-earmark";
    }
  };

  return (
    <div className="container-fluid my-5">
      <h2 className="text-center mb-4 fw-bold">📚 Study Materials & Books</h2>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6 offset-md-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search by Title or Teacher"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="text-center text-muted fs-5 mt-5">No materials available.</div>
      ) : (
        <div className="row g-4">
          {filteredMaterials.map((m) => (
            <div className="col-lg-4 col-md-6" key={m._id}>
              <div className="card h-100 shadow-sm border-0 card-bg">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <i className={`bi ${getFileIcon(m.url)} fs-2 text-primary me-3`}></i>
                    <h5 className="card-title mb-0 fw-bold">{m.title}</h5>
                  </div>
                  <p className="card-text mb-1"><strong>Teacher:</strong> {m.teacherUsername}</p>
                  <p className="card-text mb-3"><strong>Date:</strong> {new Date(m.uploadedAt).toLocaleDateString()}</p>
                  <div className="mt-auto d-flex gap-2">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary flex-fill btn-sm"
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </a>
                    <a
                      href={`${API_BASE}/api/study-material/${m._id}/download`}
                      className="btn btn-primary flex-fill btn-sm"
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center mt-4">
        <button className="btn btn-secondary btn-lg" onClick={fetchMaterials}>
          Refresh Materials
        </button>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          .btn-sm {
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }
          .card-bg {
            background-color: #f8f9fa; /* light gray background */
            border-radius: 0.5rem;
          }
          .hover-shadow:hover {
            transform: translateY(-3px);
            transition: 0.3s;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
          .card-title {
            font-size: 1.2rem;
          }
          .card-text {
            font-size: 1rem;
          }
        `}
      </style>
    </div>
  );
};

export default StudentMaterials;
