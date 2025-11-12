// frontend/src/pages/student/MyLibrary.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/Navbar';
import axios from 'axios';

const MyLibrary = () => {
  const sidebarItems = ['Dashboard','My Library','Issue/Return','Wishlist','Feedback','Digital Library'];
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/issues').then(res => setIssues(res.data));
  }, []);

  return (
    <div className="d-flex">
      <Sidebar items={sidebarItems}/>
      <div className="flex-grow-1">
        <TopNavbar title="My Library"/>
        <div className="p-3">
          <ul className="list-group">
            {issues.map(issue=>(
              <li key={issue._id} className="list-group-item">
                {issue.book.title} - Due: {new Date(issue.dueDate).toLocaleDateString()} - Returned: {issue.returnDate ? 'Yes' : 'No'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MyLibrary;
