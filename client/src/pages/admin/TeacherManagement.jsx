import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teacher/all");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
       console.error("Axios response:", err.response);
      setMessage({ type: "error", text: "Failed to fetch teachers." });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add / Update teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (editId) {
        // Update teacher
        await axios.put(`http://localhost:5000/api/teacher/${editId}`, form);
        setMessage({ type: "success", text: "Teacher updated successfully." });
      } else {
        // Create teacher
        const res = await axios.post("http://localhost:5000/api/teacher/register", form);
        const createdTeacher = res.data.teacher; // ✅ backend se teacher object
        const teacherEmail = createdTeacher.email;
        const teacherId = createdTeacher.username; // backend expects studentId
        const teacherPassword = form.password;

        // Send email to teacher
        try {
          await axios.post("http://localhost:5000/api/mail/send-mail", {
            teacherEmail,
            studentId: teacherId,
            tempPassword: teacherPassword,
          });

          setMessage({
            type: "success",
            text: "✅ Teacher created and email sent successfully.",
          });
        } catch (mailErr) {
          console.error("Mail send error:", mailErr.response || mailErr);
          setMessage({
            type: "error",
            text: "⚠️ Teacher created but email could not be sent. Check backend or mail config.",
          });
        }
      }

      // Reset form and refresh list
      setForm({ username: "", email: "", phone: "", password: "" });
      setEditId(null);
      await fetchTeachers();
    } catch (err) {
      console.error("Error saving teacher:", err.response?.data || err);
      const errText = err.response?.data?.msg || err.response?.data?.error || err.message || "Failed to save teacher";
      setMessage({ type: "error", text: errText });
    } finally {
      setLoading(false);
    }
  };

  // Edit teacher
  const handleEdit = (teacher) => {
    setForm({
      username: teacher.username || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      password: "",
    });
    setEditId(teacher._id);
    setMessage(null);
  };

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    setLoading(true);
    setMessage(null);
    try {
      await axios.delete(`http://localhost:5000/api/teacher/${id}`);
      setMessage({ type: "success", text: "Teacher deleted successfully." });
      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher:", err);
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to delete teacher" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-container container-fluid py-4">
      <h2 className="mb-4 text-center text-primary fw-bold">
        👨‍🏫 Teacher Management Dashboard
      </h2>

      {/* Message */}
      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row">
        {/* Left - Form */}
        <div className="col-md-4">
          <div className="card shadow-lg border-0 rounded-4 mb-4">
            <div className="card-header bg-primary text-white fw-bold text-center rounded-top-4">
              {editId ? "✏️ Update Teacher" : "➕ Add New Teacher"}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" required disabled={loading} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required disabled={loading || !!editId} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} className="form-control" required disabled={loading} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder={editId ? "Leave blank to keep same" : ""} required={!editId} disabled={loading} />
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : editId ? "Update" : "Add"}
                </button>

                {editId && (
                  <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => { setEditId(null); setForm({ username: "", email: "", phone: "", password: "" }); setMessage(null); }} disabled={loading}>
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Right - Teacher List */}
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-dark text-white fw-bold text-center rounded-top-4">📋 Teacher List</div>
            <div className="card-body table-responsive">
              <table className="table table-hover table-bordered align-middle text-center mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Password</th>
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length > 0 ? teachers.map((t) => (
                    <tr key={t._id}>
                      <td>{t.username}</td>
                      <td>{t.email}</td>
                      <td>{t.phone}</td>
                      <td>********</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(t)} disabled={loading}><i className="bi bi-pencil-square"></i></button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)} disabled={loading}><i className="bi bi-trash3"></i></button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" className="text-muted py-3">🚫 No teachers found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;
