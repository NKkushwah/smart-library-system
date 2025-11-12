import React, { useState } from 'react';
import { addBook } from '../api/adminApi';

const BookForm = () => {
  const [formData, setFormData] = useState({ title:'', author:'', category:'', stock:0, type:'book' });

  const handleSubmit = e=>{
    e.preventDefault();
    addBook(formData).then(res=>alert('Book added!'));
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <input placeholder="Title" value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} required />
      <input placeholder="Author" value={formData.author} onChange={e=>setFormData({...formData,author:e.target.value})} required />
      <input placeholder="Category" value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} />
      <input type="number" placeholder="Stock" value={formData.stock} onChange={e=>setFormData({...formData,stock:e.target.value})} />
      <select value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})}>
        <option value="book">Book</option>
        <option value="ebook">E-Book</option>
        <option value="journal">Journal</option>
        <option value="magazine">Magazine</option>
      </select>
      <button type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;
