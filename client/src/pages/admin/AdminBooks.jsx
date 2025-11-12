import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    stock: "", // model ke hisaab se "stock" field
    type: "book" // default type
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // 🔹 Backend se data fetch
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/books/${editId}`, {
          ...formData,
          stock: parseInt(formData.stock)
        });
      } else {
        await axios.post("http://localhost:5000/api/books", {
          ...formData,
          stock: parseInt(formData.stock)
        });
      }
      fetchBooks();
      setFormData({ title: "", author: "", category: "", stock: "", type: "book" });
      setEditId(null);
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // 🔹 Edit
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      stock: book.stock,
      type: book.type || "book",
    });
    setEditId(book._id);
  };

  // 🔹 Search filter
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-primary mb-4">📚 Book Management</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by Title, Author, or Category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Book Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            min="0"   // ✅ Minimum stock 0
            className="form-control"
            placeholder="Stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-success w-100">
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Books Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>📖 Title</th>
            <th>✍️ Author</th>
            <th>🏷️ Category</th>
            <th>📦 Stock</th>
            <th>📘 Type</th>
            <th>📌 Status</th>
            <th>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.stock}</td>
                <td>{book.type}</td>
                <td>
                  {book.stock > 0 ? (
                    <span className="badge bg-success">Available</span>
                  ) : (
                    <span className="badge bg-danger">Unavailable</span> // ✅ 0 stock → Unavailable
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(book)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(book._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                ❌ No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooks;
