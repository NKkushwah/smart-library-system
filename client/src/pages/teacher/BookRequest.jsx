// frontend/src/pages/teacher/BookRequest.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/Navbar';
import axios from 'axios';

const BookRequest = () => {
  const sidebarItems = ['Dashboard','Book Request','Upload Material','Student Monitoring','Announcements'];
  const [request, setRequest] = useState('');

  const sendRequest = () => {
    axios.post('http://localhost:5000/api/notifications', {message: `Book Request: ${request}`, userRole: 'admin'})
      .then(res => setRequest(''));
  }

  return (
    <div className="d-flex">
      <Sidebar items={sidebarItems}/>
      <div className="flex-grow-1">
        <TopNavbar title="Book Request"/>
        <div className="p-3">
          <input className="form-control mb-2" placeholder="Enter book name" value={request} onChange={e=>setRequest(e.target.value)}/>
          <button className="btn btn-primary" onClick={sendRequest}>Send Request</button>
        </div>
      </div>
    </div>
  );
}

export default BookRequest;
