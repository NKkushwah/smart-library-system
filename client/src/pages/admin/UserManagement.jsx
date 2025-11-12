// frontend/src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/Navbar';
import axios from 'axios';

const UserManagement = () => {
  const sidebarItems = ['Dashboard','Book Management','User Management','Issue/Return Logs','Reports','Notifications'];
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users').then(res => setUsers(res.data));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = () => {
    axios.post('http://localhost:5000/api/users', {name, email, role, password: '123456'})
      .then(res => fetchUsers());
    setName(''); setEmail(''); setRole('student');
  }

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5000/api/users/${id}`).then(res => fetchUsers());
  }

  return (
    <div className="d-flex">
      <Sidebar items={sidebarItems}/>
      <div className="flex-grow-1">
        <TopNavbar title="User Management"/>
        <div className="p-3">
          <div className="mb-3">
            <input className="form-control mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
            <input className="form-control mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <select className="form-select mb-2" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary" onClick={addUser}>Add User</button>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={()=>deleteUser(user._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagement;
