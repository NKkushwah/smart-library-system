import { createContext, useContext, useState, useEffect } from "react";

// Context create karo
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    studentId: localStorage.getItem("studentId") || null,
    profileImage: localStorage.getItem("profileImage") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  // ✅ Store token and user info
  const storeTokenAndUser = (token, userInfo) => {
    localStorage.setItem("token", token);
    if (userInfo.role) localStorage.setItem("role", userInfo.role);
    if (userInfo.studentId) localStorage.setItem("studentId", userInfo.studentId);
    if (userInfo.profileImage) localStorage.setItem("profileImage", userInfo.profileImage);
    localStorage.setItem("user", JSON.stringify(userInfo));

    setAuth({
      token,
      role: userInfo.role || null,
      studentId: userInfo.studentId || null,
      profileImage: userInfo.profileImage || null,
      user: userInfo || null,
    });
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.clear();
    setAuth({
      token: null,
      role: null,
      studentId: null,
      profileImage: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, storeTokenAndUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
