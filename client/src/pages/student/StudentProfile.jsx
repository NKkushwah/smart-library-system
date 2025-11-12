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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", phone: "" });

  // 🔹 Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login.");

        const res = await axios.get("http://localhost:5000/api/student/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const student = res.data; // backend returns the student object directly
        setProfile(student);
        setFormData({
          username: student.username || "",
          email: student.email || "",
          phone: student.phone || "",
        });
        setProfileImage(student.profileImage || "");
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please login again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setProfileImage(base64Image);

      try {
        const token = localStorage.getItem("token");
        await axios.put(
          "http://localhost:5000/api/student/profile-image",
          { profileImage: base64Image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Profile image update failed:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save updated profile
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/student/me",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(res.data.student || res.data); // backend may return {student:...} or direct object
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile. Try again.");
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
    <div className="container d-flex justify-content-center align-items-center py-4" style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <div className="col-lg-6 col-md-8">
        <div className="card shadow-lg border-0 p-4 text-center" style={{ borderRadius: "20px", background: "white", minHeight: "420px" }}>
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
          <h4 className="fw-bold mb-2">{profile?.username || "Student"}</h4>
          <p className="text-muted" style={{ marginTop: "-5px" }}>
            {profile?.role?.toUpperCase() || "STUDENT"}
          </p>

          {/* Personal Info */}
          <div className="text-start mt-4">
            <h6 className="mb-3 fw-bold">Personal Information</h6>
            <div className="row small mb-2">
              <div className="col-5 fw-bold">Full Name:</div>
              <div className="col-7">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                  />
                ) : (
                  profile?.username
                )}
              </div>
            </div>
            <div className="row small mb-2">
              <div className="col-5 fw-bold">Email:</div>
              <div className="col-7">
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                  />
                ) : (
                  profile?.email
                )}
              </div>
            </div>
            <div className="row small mb-2">
              <div className="col-5 fw-bold">Phone:</div>
              <div className="col-7">
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control form-control-sm"
                  />
                ) : (
                  profile?.phone
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 d-flex justify-content-center gap-3">
            {isEditing ? (
              <>
                <button className="btn btn-success px-4 py-2 fw-semibold shadow-sm" onClick={handleSaveProfile}>
                  Save
                </button>
                <button className="btn btn-secondary px-4 py-2 fw-semibold shadow-sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary px-4 py-2 fw-semibold shadow-sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileDashboard;
