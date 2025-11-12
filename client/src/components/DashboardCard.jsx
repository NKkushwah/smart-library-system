import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardCard = ({ title, value, color }) => {
  return (
    <div className={`card text-white bg-${color} mb-3`} style={{ maxWidth: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h3>{value}</h3>
      </div>
    </div>
  );
};

export default DashboardCard;
