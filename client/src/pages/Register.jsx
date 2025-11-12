import { useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "../components/Footer";
import "./register.css";

export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "student", 
  });

  const navigate = useNavigate();
  const { storeTokenAndUser } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Normalize email before sending
      const normalizedEmail = user.email.trim().toLowerCase();

      const response = await fetch("http://localhost:5000/api/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          email: normalizedEmail,
          phone: user.phone,
          password: user.password,
          role: user.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Reset form
        setUser({ username: "", email: "", phone: "", password: "", role: "student" });

        // ✅ Navigate to login page
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert("Registration failed: " + (data.msg || data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert("Error connecting to server!");
    }
  };

  return (
    <>
      <section className="register-section d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center d-none d-md-block">
              <img
                src="/Images/registeration.jpg"
                alt="Registration illustration"
                className="img-fluid rounded shadow-lg register-img"
              />
            </div>

            <div className="col-md-6">
              <div className="card shadow-lg border-0 p-4 rounded-4">
                <h2 className="text-center text-primary fw-bold mb-4">
                  Student Registration
                </h2>

                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Enter your username"
                      required
                      value={user.username}
                      onChange={handleInput}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope-fill"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      required
                      value={user.email}
                      onChange={handleInput}
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <i className="bi bi-telephone-fill"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      name="phone"
                      placeholder="Enter your phone number"
                      required
                      value={user.phone}
                      onChange={handleInput}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter your password"
                      required
                      value={user.password}
                      onChange={handleInput}
                    />
                  </div>

                  {/* Role */}
                  <input type="hidden" name="role" value={user.role} />

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg rounded-3"
                    >
                      Register Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Register;
