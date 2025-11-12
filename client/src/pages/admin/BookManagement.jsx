// frontend/src/pages/admin/BookManagement.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/Navbar';
import axios from 'axios';

const BookManagement = () => {
  const sidebarItems = ['Dashboard','Book Management','User Management','Issue/Return Logs','Reports','Notifications'];

  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    stock: 1,
    digital_link: '',
    type: 'ebook'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch books
  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to fetch books' });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add book
  const addBook = async () => {
    if (!form.title || !form.author || !form.category || !form.type) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.post('http://localhost:5000/api/books', form);
      setMessage({ type: 'success', text: 'Book added successfully!' });
      setForm({ title:'', author:'', category:'', stock:1, digital_link:'', type:'ebook' });
      fetchBooks();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to add book' });
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      setMessage({ type: 'success', text: 'Book deleted successfully!' });
      fetchBooks();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to delete book' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar items={sidebarItems} />

      <div className="flex-grow-1">
        <TopNavbar title="Book Management" />
        <div className="p-3">

          {/* Alert */}
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message.text}
            </div>
          )}

          {/* Add Book Form */}
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="mb-3">➕ Add New Book</h5>
            <div className="row g-2">
              <div className="col-md-4">
                <input className="form-control" placeholder="Title *" name="title" value={form.title} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <input className="form-control" placeholder="Author *" name="author" value={form.author} onChange={handleChange}/>
              </div>
              <div className="col-md-4">
                <input className="form-control" placeholder="Category *" name="category" value={form.category} onChange={handleChange}/>
              </div>
              <div className="col-md-2">
                <input className="form-control" type="number" min="1" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock"/>
              </div>
              <div className="col-md-5">
                <input className="form-control" placeholder="Digital Link" name="digital_link" value={form.digital_link} onChange={handleChange}/>
              </div>
              <div className="col-md-3">
                <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                  <option value="ebook">Ebook</option>
                  <option value="book">Book</option>
                  <option value="journal">Journal</option>
                  <option value="magazine">Magazine</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={addBook} disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Add Book'}
                </button>
              </div>
            </div>
          </div>

          {/* Book List */}
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">📋 Book List</h5>
            <table className="table table-hover table-bordered align-middle text-center mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Digital Link</th>
                  <th>Type</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? books.map(book => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.stock}</td>
                    <td>{book.digital_link ? <a href={book.digital_link} target="_blank" rel="noopener noreferrer">Open</a> : '-'}</td>
                    <td>{book.type}</td>
                    <td>{new Date(book.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteBook(book._id)} disabled={loading}>Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="8" className="text-muted py-3">🚫 No books found</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookManagement;
