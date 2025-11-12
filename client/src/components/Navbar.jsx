import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth";

const Navbar = () => {
  const { user, logout } = useAuth(); // 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  return (
    <header>
      <div className="container">
        <div className="logo-brand">
          <NavLink to="/">My Library</NavLink>
        </div>
        <nav>
          <ul>
            {/* 🔹 Agar login nahi hai */}
            {!user ? (
              <>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/contact">Contact</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
              </>
            ) : (
              
              <>
                {user.role === "student" && (
                  <li>
                    <NavLink to="/student/dashboard">Student Dashboard</NavLink>
                  </li>
                )}
                {user.role === "teacher" && (
                  <li>
                    <NavLink to="/teacher/dashboard">Teacher Dashboard</NavLink>
                  </li>
                )}
                {user.role === "admin" && (
                  <li>
                    <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                  </li>
                )}
                <li className="nav-item">
  <button 
    onClick={handleLogout} 
    className="btn btn-danger btn-sm rounded-pill shadow-sm ms-3"
    style={{ padding: "5px 15px", fontWeight: "500" }}
  >
    Logout
  </button>
</li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
