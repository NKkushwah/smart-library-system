// src/components/Sidebar.jsx
import React from "react";

const Sidebar = ({ items }) => {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
      <h4 className="mb-4 text-center">Admin Panel</h4>
      <ul className="list-unstyled">
        {items.map((item, index) => (
          <li key={index} className="mb-3">
            <button className="btn btn-outline-light w-100">{item}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
