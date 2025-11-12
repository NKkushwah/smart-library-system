// src/pages/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_BASE = "http://localhost:5000";

const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [material, setMaterial] = useState(null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [materialsList, setMaterialsList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch teacher profile
    axios.get(`${API_BASE}/api/teacher/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProfile(res.data);
        if(res.data.profileImage) setProfileImage(res.data.profileImage);
      })
      .catch(err => console.error(err));

    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/study-material`);
      setMaterialsList(res.data || []);
    } catch(err) {
      console.error(err);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if(!material || !materialTitle.trim()) {
      alert("Select a file and enter title!");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", material);
    formData.append("title", materialTitle);
    formData.append("teacher", profile?.username || "");

    try {
      setIsUploading(true);
      setUploadProgress(0);
      await axios.post(`${API_BASE}/api/study-material`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        onUploadProgress: e => {
          if(!e.total) return;
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      });
      alert("Material uploaded!");
      setMaterial(null);
      setMaterialTitle("");
      setUploadProgress(0);
      setIsUploading(false);
      fetchMaterials();
    } catch(err) {
      console.error(err);
      alert("Upload failed");
      setIsUploading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if(!window.confirm("Are you sure you want to delete this material?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE}/api/study-material/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Material deleted!");
      fetchMaterials();
    } catch(err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) setProfileImage(URL.createObjectURL(file));
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: "250px" }}>
        <div className="text-center mb-4">
          {profileImage ? (
            <img src={profileImage} alt="teacher" className="rounded-circle border border-3 border-light shadow mb-2"
              style={{ width: "80px", height: "80px", objectFit: "cover" }} />
          ) : (
            <div className="rounded-circle d-flex align-items-center justify-content-center border border-3 border-light shadow bg-secondary mb-2"
              style={{ width: "80px", height: "80px" }}>
              <span className="fs-3 fw-bold text-white">T</span>
            </div>
          )}
          <input type="file" id="profile-upload" className="d-none" onChange={handleImageChange} />
          <label htmlFor="profile-upload" className="btn btn-sm btn-primary rounded-circle position-relative" 
            style={{ bottom: "35px", left: "55px", padding: "0.25rem 0.4rem", cursor: "pointer" }}>
            <i className="bi bi-camera-fill"></i>
          </label>
          <h6 className="mt-2">{profile?.username || "Teacher"}</h6>
          <small className="text-muted">{profile?.empId || "ID"}</small>
        </div>

        <ul className="nav flex-column">
          <li className="nav-item mb-2"><Link className="text-white text-decoration-none" to="/teacherprofile"><i className="bi bi-person-circle me-2"></i> Profile</Link></li>
          <li className="nav-item mb-2"><Link className="text-white text-decoration-none" to="/teacher/upload"><i className="bi bi-upload me-2"></i> Upload Material</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <h3 className="mb-4">Welcome, {profile?.username || "Teacher"} </h3>

        {/* Upload Material Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold bg-success text-white">📂 Upload Study Material</div>
          <div className="card-body">
            <form onSubmit={handleUploadMaterial}>
              <input type="text" className="form-control mb-2" placeholder="Material title" 
                value={materialTitle} onChange={e => setMaterialTitle(e.target.value)} required />
              <input type="file" className="form-control mb-2" onChange={e => setMaterial(e.target.files[0])} accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" />
              {uploadProgress > 0 && 
                <div className="progress mb-2">
                  <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
                </div>
              }
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm"> {isUploading ? "Uploading..." : "Upload"} </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setMaterial(null); setMaterialTitle(""); setUploadProgress(0); }}>Reset</button>
              </div>
            </form>
          </div>
        </div>

        {/* Uploaded Materials Card */}
        <div className="card shadow-sm">
          <div className="card-header fw-bold bg-info text-white">📚 Uploaded Materials</div>
          <div className="card-body">
            {materialsList.length === 0 ? <div className="text-muted">No materials uploaded yet.</div> :
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Teacher</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialsList.map(m => (
                      <tr key={m._id}>
                        <td>{m.title}</td>
                        <td>{m.teacherUsername}</td>
                        <td>{new Date(m.uploadedAt).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm btn-equal">View</a>
                            <a href={`${API_BASE}/api/study-material/${m._id}/download`} className="btn btn-primary btn-sm btn-equal">Download</a>
                            <button className="btn btn-danger btn-sm btn-equal" onClick={() => handleDeleteMaterial(m._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            <button className="btn btn-secondary btn-sm mt-2" onClick={fetchMaterials}>Refresh</button>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          .btn-equal {
            flex: 1;
            padding: 0.25rem 0.35rem;
            font-size: 0.75rem;
          }
        `}
      </style>
    </div>
  );
};

export default TeacherDashboard;
