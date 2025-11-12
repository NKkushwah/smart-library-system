// frontend/src/pages/student/Wishlist.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/Navbar';

const Wishlist = () => {
  const sidebarItems = ['Dashboard','My Library','Issue/Return','Wishlist','Feedback','Digital Library'];
  const [wishlist, setWishlist] = useState([]);
  const [book, setBook] = useState('');

  const addToWishlist = () => {
    setWishlist([...wishlist, book]);
    setBook('');
  }

  return (
    <div className="d-flex">
      <Sidebar items={sidebarItems}/>
      <div className="flex-grow-1">
        <TopNavbar title="Wishlist"/>
        <div className="p-3">
          <input className="form-control mb-2" placeholder="Book name" value={book} onChange={e=>setBook(e.target.value)}/>
          <button className="btn btn-primary mb-2" onClick={addToWishlist}>Add to Wishlist</button>
          <ul className="list-group">
            {wishlist.map((b,i)=><li key={i} className="list-group-item">{b}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Wishlist;
