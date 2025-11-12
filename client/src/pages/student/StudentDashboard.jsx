import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);

  // 🔹 Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/student/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        if (res.data.profileImage) setProfileImage(res.data.profileImage);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Fetch all books (for author info)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Books fetch error:", err));
  }, []);

  // 🔹 Fetch borrowed books for logged-in student (fine bhi DB se aayega)
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/issuebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only books issued to logged-in student
        const studentBooks = res.data.filter(
          (b) => b.studentName === profile?.username
        );

        setBorrowedBooks(studentBooks);
      } catch (err) {
        console.error("Borrowed books fetch error:", err);
      }
    };

    if (profile?.username) fetchBorrowedBooks();
  }, [profile]);

  // 🔹 Image upload handler (frontend only)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  // 🔹 Stats (fine DB se le raha hai)
  const totalIssued = borrowedBooks.length;
  const pendingReturns = borrowedBooks.filter(
    (b) => new Date(b.returnDate) < new Date() && b.status !== "returned"
  ).length;
  const totalFines = borrowedBooks.reduce((acc, b) => acc + (b.fine || 0), 0);
  const reservedBooks = borrowedBooks.filter((b) => b.status === "reserved").length;

  // 🔹 Helper to get author from books table
  const getAuthor = (bookTitle) => {
    const book = books.find((b) => b.title === bookTitle);
    return book ? book.author : "-";
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: "250px" }}>
        <div className="text-center mb-4 position-relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="student"
              className="rounded-circle border border-3 border-light shadow"
              style={{ width: "70px", height: "70px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center border border-3 border-light shadow bg-secondary"
              style={{ width: "70px", height: "70px", margin: "0 auto" }}
            >
              <span className="fs-3 fw-bold text-white">RS</span>
            </div>
          )}

          <label
            htmlFor="profile-upload"
            className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 shadow"
            style={{ cursor: "pointer", transform: "translate(-5px, -5px)" }}
          >
            <i className="bi bi-camera-fill text-white"></i>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <h6 className="mt-2">{profile?.username || "Loading..."}</h6>
          <small className="text-muted">
            {profile?.rollNo || profile?._id?.slice(-6).toUpperCase() || "ID"}
          </small>
        </div>

        <h5 className="mb-3">My Library</h5>
        <ul className="nav flex-column w-100">
          <li className="nav-item mb-3">
            <Link to="/profile" className="text-white text-decoration-none">
              <i className="bi bi-person-circle me-2"></i> Profile
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link to="/studentmaterials" className="text-white text-decoration-none">
              <i className="bi bi-search me-2"></i> Digital Library
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link to="/issue-return" className="text-white text-decoration-none">
              <i className="bi bi-book me-2"></i> Issue/Return Books
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link to="/records" className="text-white text-decoration-none">
              <i className="bi bi-clock-history me-2"></i> Pay Fine
            </Link>
          </li>
        </ul>
      </div>

      {/* Dashboard Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Welcome, {profile?.username || "Student"} 👋</h3>
        </div>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h5>Books Issued</h5>
              <p className="fw-bold fs-4 text-primary">{totalIssued}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h5>Pending Returns</h5>
              <p className="fw-bold fs-4 text-danger">{pendingReturns}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h5>Total Fines</h5>
              <p className="fw-bold fs-4 text-warning">₹{totalFines}</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h5>Reserved Books</h5>
              <p className="fw-bold fs-4 text-success">{reservedBooks}</p>
            </div>
          </div>
        </div>

        {/* Borrowed Books Table */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold">📖 My Borrowed Books</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Fine (₹)</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.book}</td>
                    <td>{getAuthor(book.book)}</td>
                    <td>{new Date(book.issueDate).toLocaleDateString()}</td>
                    <td>{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          book.status === "returned"
                            ? "bg-secondary"
                            : book.fine > 0
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {book.status === "returned"
                          ? "Returned"
                          : book.fine > 0
                          ? "Overdue"
                          : "On Time"}
                      </span>
                    </td>
                    <td>{book.fine || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="card shadow-sm">
          <div className="card-header fw-bold">🔔 Notifications</div>
          <div className="card-body">
            <ul>
              {borrowedBooks
                .filter((b) => b.fine > 0 && b.status !== "returned")
                .map((b) => (
                  <li key={b._id}>
                    Your book <b>{b.book}</b> is overdue. Fine: ₹{b.fine}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
