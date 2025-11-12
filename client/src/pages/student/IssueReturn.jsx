// frontend/src/pages/student/IssueReturn.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/Navbar';
import axios from 'axios';

const IssueReturn = () => {
  const sidebarItems = ['Dashboard','My Library','Issue/Return','Wishlist','Feedback','Digital Library'];
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/books').then(res => setBooks(res.data));
  }, []);

  const issueBook = (id) => {
    axios.post('http://localhost:5000/api/issues/issue', {bookId:id, userId:'student1', dueDate:new Date(Date.now()+7*24*60*60*1000)})
      .then(res => setIssuedBooks([...issuedBooks,res.data]));
  }

  return (
    <div className="d-flex">
      <Sidebar items={sidebarItems}/>
      <div className="flex-grow-1">
        <TopNavbar title="Issue / Return"/>
        <div className="p-3">
          <h5>Available Books</h5>
          <ul className="list-group mb-3">
            {books.map(book=>(
              <li key={book._id} className="list-group-item d-flex justify-content-between align-items-center">
                {book.title} - {book.author}
                <button className="btn btn-sm btn-primary" onClick={()=>issueBook(book._id)}>Issue</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IssueReturn;
