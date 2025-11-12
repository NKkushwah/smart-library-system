// src/components/SimpleProfileDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const SimpleProfileDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ username: "", email: "", phone: "" });

  // 🔹 Backend se profile fetch karna
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");

        const res = await axios.get("http://localhost:5000/api/teacher/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        setProfileImage(res.data.profileImage || "");
        setEditData({
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone,
        });
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please login again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Profile image upload & save backend
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result; // base64
      setProfileImage(base64Image);

      try {
        const token = localStorage.getItem("token");
        await axios.put(
          "http://localhost:5000/api/teacher/profile-image",
          { profileImage: base64Image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Profile image update failed:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Handle profile edit save
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/teacher/me",
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(res.data.teacher); // update local profile
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5 className="text-danger">{error}</h5>
      </div>
    );
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center py-4"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <div className="col-lg-6 col-md-8">
        <div
          className="card shadow-lg border-0 p-4 text-center"
          style={{ borderRadius: "20px", background: "white", minHeight: "450px" }}
        >
          {/* Profile Image */}
          <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-circle border border-3 border-primary"
                width="110"
                height="110"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle border border-3 border-primary d-flex justify-content-center align-items-center"
                style={{
                  width: "110px",
                  height: "110px",
                  fontSize: "45px",
                  color: "#0d6efd",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <i className="bi bi-person"></i>
              </div>
            )}

            <label
              htmlFor="profileUpload"
              className="bg-primary text-white rounded-circle p-2 border border-2"
              style={{ cursor: "pointer", fontSize: "18px", marginTop: "70px", marginLeft: "-40px" }}
            >
              <i className="bi bi-camera-fill"></i>
            </label>
            <input
              type="file"
              id="profileUpload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Name & Role */}
          {!editMode ? (
            <>
              <h4 className="fw-bold mb-2">{profile.username}</h4>
              <p className="text-muted" style={{ marginTop: "-5px" }}>
                {profile.role?.toUpperCase()}
              </p>
            </>
          ) : (
            <form onSubmit={handleProfileUpdate} className="text-start">
              <div className="mb-2">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2 mt-3 justify-content-center">
                <button type="submit" className="btn btn-success px-4">Save</button>
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Personal Info */}
          {!editMode && (
            <div className="text-start mt-4">
              <h6 className="mb-3 fw-bold">Personal Information</h6>
              <div className="row small mb-2">
                <div className="col-5 fw-bold">Full Name:</div>
                <div className="col-7">{profile.username}</div>
              </div>
              <div className="row small mb-2">
                <div className="col-5 fw-bold">Email:</div>
                <div className="col-7">{profile.email}</div>
              </div>
              <div className="row small mb-2">
                <div className="col-5 fw-bold">Phone:</div>
                <div className="col-7">{profile.phone}</div>
              </div>
            </div>
          )}

          {/* Buttons */}
          {!editMode && (
            <div className="mt-4 d-flex justify-content-center gap-3">
              <button
                className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-outline-danger px-4 py-2 fw-semibold shadow-sm"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileDashboard;
