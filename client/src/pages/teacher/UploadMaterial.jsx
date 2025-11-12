// frontend/src/pages/teacher/UploadMaterial.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavbar from '../../components/Navbar';

const UploadMaterial = () => {
  const sidebarItems = ['Dashboard','Book Request','Upload Material','Student Monitoring','Announcements'];
  const [file, setFile] = useState(null);

  const upload = () => {
    alert(`File uploaded: ${file?.name}`);
    setFile(null);
  }

  return (
    <div className="d-flex">
      <Sidebar items={sidebarItems}/>
      <div className="flex-grow-1">
        <TopNavbar title="Upload Material"/>
        <div className="p-3">
          <input type="file" className="form-control mb-2" onChange={e=>setFile(e.target.files[0])}/>
          <button className="btn btn-primary" onClick={upload}>Upload</button>
        </div>
      </div>
    </div>
  )
}

export default UploadMaterial;
