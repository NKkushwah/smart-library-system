import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import "./login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";

const STUDENT_URL = "http://localhost:5000/api/student/login";
const ADMIN_URL = "http://localhost:5000/api/admin/login";
const TEACHER_URL = "http://localhost:5000/api/teacher/login";

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "student", // default
  });

  const navigate = useNavigate();
  const { storeTokenAndUser } = useAuth();

  //  handle input fields
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  //  handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let URL = "";
    let redirectPath = "";

    if (user.role === "student") {
      URL = STUDENT_URL;
      redirectPath = "/student/dashboard";
    } else if (user.role === "admin") {
      URL = ADMIN_URL;
      redirectPath = "/admin/dashboard";
    } else if (user.role === "teacher") {
      URL = TEACHER_URL;
      redirectPath = "/teacher/dashboard";
    } else {
      alert("Only Student, Teacher, or Admin login is available!");
      return;
    }

    try {
      // ✅ Normalize email before sending (matches backend normalization)
      const normalizedEmail = user.email.trim().toLowerCase();

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password: user.password,
          role: user.role,
        }),
      });

      const res_data = await response.json();

      if (response.ok) {
        alert(`${user.role} login successful `);

        // ✅ Store token & user details globally (context + localStorage)
        storeTokenAndUser(res_data.token, {
          role: res_data.role,
          email: normalizedEmail,
          studentId: res_data.studentId || null,
          profileImage: res_data.profileImage || null,
        });

        // 🧹 Reset form
        setUser({ email: "", password: "", role: "student" });

        // 🔀 Redirect to dashboard
        navigate(redirectPath);
      } else {
        alert(res_data.msg || res_data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server Error — Please try again later.");
    }
  };

  return (
    <>
      <section className="login-section py-5">
        <main>
          <div className="container">
            <div className="row align-items-center">
              {/* Left side image */}
              <div className="col-md-6 text-center mb-4 mb-md-0">
                <img
                  src="/Images/registeration.jpg"
                  alt="login illustration"
                  className="img-fluid rounded shadow"
                />
              </div>

              {/* Right side form */}
              <div className="col-md-6">
                <div className="login-form p-4 rounded shadow">
                  <h1 className="text-center mb-4">
                    {user.role === "admin"
                      ? "Admin Login"
                      : user.role === "teacher"
                      ? "Teacher Login"
                      : "Student Login"}
                  </h1>

                  <form onSubmit={handleSubmit}>
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

                    {/* Role selection */}
                    <div className="mb-3 input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-badge-fill"></i>
                      </span>
                      <select
                        className="form-select"
                        name="role"
                        value={user.role}
                        onChange={handleInput}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {/* Button */}
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                      Login Now
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Login;
