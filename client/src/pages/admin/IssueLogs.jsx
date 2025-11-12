import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const IssueBooks = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    book: "",
    issueDate: "",
    returnDate: "",
  });

  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch books
  useEffect(() => {
    axios.get("http://localhost:5000/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Books fetch error:", err));
  }, []);

  // Fetch students
  useEffect(() => {
    axios.get("http://localhost:5000/api/student/all")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Students fetch error:", err));
  }, []);

  // Fetch issued books
  const fetchRecords = () => {
    axios.get("http://localhost:5000/api/issuebooks")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("IssueBooks fetch error:", err));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add Issue Book
  const handleAdd = () => {
    if (!formData.studentId || !formData.studentName || !formData.book || !formData.issueDate || !formData.returnDate) {
      alert("Please fill all required fields!");
      return;
    }

    // Date validation (Return Date must be >= Issue Date)
    const issue = new Date(formData.issueDate);
    const ret = new Date(formData.returnDate);
    if (ret < issue) {
      alert("❌ Return Date cannot be before Issue Date!");
      return;
    }

    const selectedBook = books.find((b) => b.title === formData.book);
    if (!selectedBook || selectedBook.stock <= 0) {
      alert("This book is not available!");
      return;
    }

    const payload = {
      ...formData,
      issueDate: formData.issueDate,
      returnDate: formData.returnDate,
    };

    axios.post("http://localhost:5000/api/issuebooks", payload)
      .then(() => {
        fetchRecords();
        setFormData({
          studentId: "",
          studentName: "",
          book: "",
          issueDate: "",
          returnDate: "",
        });
      })
      .catch((err) => {
        console.error("Add issuebook error:", err);
        alert("Error issuing book: " + (err.response?.data?.message || err.message));
      });
  };

  // ✅ Delete record
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios.delete(`http://localhost:5000/api/issuebooks/${id}`)
        .then(() => fetchRecords())
        .catch((err) => {
          console.error("Delete issuebook error:", err);
          alert("Error deleting record: " + (err.response?.data?.message || err.message));
        });
    }
  };

  // ✅ Return book
  const handleReturn = (id) => {
    axios.put(`http://localhost:5000/api/issuebooks/return/${id}`)
      .then(() => fetchRecords())
      .catch((err) => {
        console.error("Return issuebook error:", err);
        alert("Error returning book: " + (err.response?.data?.message || err.message));
      });
  };

  const getBookDetails = (rec) => {
    return books.find((b) => b.title === rec.book);
  };

  // 🔎 Search filter
  const filteredRecords = records.filter(
    (rec) =>
      rec.studentId.toLowerCase().includes(search.toLowerCase()) ||
      rec.studentName.toLowerCase().includes(search.toLowerCase()) ||
      rec.book.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-primary mb-4">📖 Issue Book Management</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by Student, Book, or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      <form className="row g-3 mb-4" onSubmit={(e) => e.preventDefault()}>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          >
            <option value="">-- Student --</option>
            {students.map((s) => (
              <option key={s._id} value={s.username}>
                {s.username}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            name="book"
            value={formData.book}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Book --</option>
            {books.map((book) => (
              <option
                key={book._id}
                value={book.title}
                disabled={book.stock <= 0}
              >
                {book.title} ({book.author}){" "}
                {book.stock <= 0 ? "- Not Available" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-1">
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-success w-100"
          >
            Add
          </button>
        </div>
      </form>

      {/* Records Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>🎓 Student ID</th>
            <th>👤 Student Name</th>
            <th>📘 Book</th>
            <th>✍️ Author</th>
            <th>📅 Issue Date</th>
            <th>📅 Return Date</th>
            <th>📅 Actual Return</th>
            <th>💰 Fine (₹)</th>
            <th>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((rec, index) => {
              const bookDetails = getBookDetails(rec);
              return (
                <tr key={rec._id}>
                  <td>{index + 1}</td>
                  <td>{rec.studentId}</td>
                  <td>{rec.studentName}</td>
                  <td>{rec.book}</td>
                  <td>{bookDetails ? bookDetails.author : "-"}</td>
                  <td>{rec.issueDate ? new Date(rec.issueDate).toLocaleDateString() : "-"}</td>
                  <td>{rec.returnDate ? new Date(rec.returnDate).toLocaleDateString() : "-"}</td>
                  <td>{rec.actualReturnDate ? new Date(rec.actualReturnDate).toLocaleDateString() : "Not Returned"}</td>
                  <td>
                    {rec.error ? (
                      <span className="text-danger">{rec.error}</span>
                    ) : (
                      rec.fine !== undefined ? rec.fine : 0
                    )}
                  </td>
                  <td>
                    {!rec.actualReturnDate && (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleReturn(rec._id)}
                      >
                        Return
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(rec._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10" className="text-center text-muted">
                 No issued records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IssueBooks;
