import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FaDownload, FaRupeeSign } from "react-icons/fa";
import axios from "axios";

const FinePaymentUI = () => {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [totalFine, setTotalFine] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paidBooks, setPaidBooks] = useState([]);
  const [receiptTotal, setReceiptTotal] = useState(0);

  // ===== Helper function to format date as DD/MM/YYYY =====
  const formatDate = (date) => {
    if (!date) return "Not Returned";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ================== Fetch Profile ==================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/student/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        if (res.data.profileImage) setProfileImage(res.data.profileImage);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ================== Fetch Books ==================
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Books fetch error:", err));
  }, []);

  // ================== Fetch Borrowed Books ==================
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/issuebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 🔹 Update: Fetch using studentName column
        const studentBooks = res.data.filter(
          (b) => b.studentName === profile?.username
        );

        setBorrowedBooks(studentBooks);
      } catch (err) {
        console.error("Borrowed books fetch error:", err);
      }
    };

    if (profile?.username) fetchBorrowedBooks();
  }, [profile]);

  // ================== Total Fine Calculate ==================
  useEffect(() => {
    const sum = borrowedBooks.reduce((acc, b) => acc + (b.fine || 0), 0);
    setTotalFine(sum);
  }, [borrowedBooks]);

  // ================== Fine Payment Handlers ==================
  const handlePayBook = (id) => {
    const bookToPay = borrowedBooks.find((b) => b._id === id);
    if (!bookToPay) return;

    setPaidBooks([bookToPay]);
    setReceiptTotal(bookToPay.fine);

    setBorrowedBooks(
      borrowedBooks.map((b) =>
        b._id === id ? { ...b, fine: 0, status: "Paid" } : b
      )
    );

    setShowReceipt(true);
  };

  const handlePayAll = () => {
    const booksWithFine = borrowedBooks.filter((b) => b.fine > 0);

    if (booksWithFine.length === 0) return;

    setPaidBooks(booksWithFine);
    setReceiptTotal(
      booksWithFine.reduce((acc, b) => acc + (b.fine || 0), 0)
    );

    const updatedBooks = borrowedBooks.map((b) => ({
      ...b,
      fine: 0,
      status: b.fine > 0 ? "Paid" : b.status,
    }));
    setBorrowedBooks(updatedBooks);

    setShowReceipt(true);
  };

  // ================== Download Receipt ==================
  const downloadReceipt = () => {
    const receiptElement = document.getElementById("receipt");
    html2canvas(receiptElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Library_Fine_Receipt.pdf");
    });
  };

  if (loading) {
    return <h3 className="text-center mt-5">Loading student profile...</h3>;
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-start"
      style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", padding: "20px" }}
    >
      <h2 className="text-center mb-4">💳 Library Fine Payment</h2>

      <div
        className="card shadow-lg p-4 w-100"
        style={{ maxWidth: "1300px", borderRadius: "15px" }}
      >
        {/* Student Info */}
        <h4 className="text-center mb-4">👤 Student Details</h4>
        <div className="d-flex flex-column align-items-center mb-3">
          <img
            src={profileImage || "https://via.placeholder.com/100"}
            alt="student"
            className="rounded-circle border border-2 mb-3"
            width={100}
            height={100}
          />
          <div className="d-flex justify-content-between flex-wrap text-center w-100">
            <div className="p-2">{profile?._id}</div>
            <div className="p-2">{profile?.username}</div>
            <div className="p-2">{profile?.email}</div>
          </div>
        </div>

        <hr />

        {/* Borrowed Books */}
        <h4 className="text-center mb-3">📖 Borrowed Books</h4>
        {borrowedBooks.length === 0 ? (
          <p className="text-center text-muted">No books issued.</p>
        ) : (
          <div
            className="row g-3 mb-3"
            style={{ maxHeight: "350px", overflowY: "auto" }}
          >
            {borrowedBooks.map((b) => (
              <div
                key={b._id}
                className="col-lg-4 col-md-6 d-flex align-items-stretch"
              >
                <div className="card shadow-sm p-3 w-100 text-center">
                  <h5>{b.book}</h5>
                  <p><strong>Issue:</strong> {formatDate(b.issueDate)}</p>
                  <p><strong>Due:</strong> {formatDate(b.dueDate)}</p>
                  <p><strong>Returned:</strong> {formatDate(b.returnDate)}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        b.status === "Paid" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {b.status || "Unpaid"}
                    </span>
                  </p>
                  <p
                    className={
                      b.fine > 0 ? "text-danger fw-bold" : "text-success fw-bold"
                    }
                  >
                    <FaRupeeSign /> {b.fine}
                  </p>
                  {b.fine > 0 && (
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handlePayBook(b._id)}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <hr />

        {/* Total Fine + QR + Pay All */}
        <div className="text-center mt-3">
          <h4>
            Total Fine:{" "}
            <span className="text-danger fw-bold">
              <FaRupeeSign /> {totalFine}
            </span>
          </h4>

          <div className="mt-3">
            <h6>📲 Scan to Pay with PhonePe</h6>
            <img
              src="/Images/phonepay.jpg"
              alt="PhonePe QR"
              className="border p-2 bg-white"
              width={180}
            />
          </div>

          {totalFine > 0 && (
            <button className="btn btn-primary mt-3 px-4" onClick={handlePayAll}>
              Pay All Fines
            </button>
          )}
        </div>

        {/* Receipt */}
        {showReceipt && (
          <div
            id="receipt"
            className="mt-4 p-4 border rounded bg-white shadow-lg"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            <h3 className="text-center">📚 College Library</h3>
            <h4 className="text-center mb-3">Library Fine Receipt</h4>

            <div className="mb-3">
              <p><strong>Student Name:</strong> {profile?.username}</p>
              <p><strong>Student ID:</strong> {profile?._id}</p>
              <p><strong>Payment Date:</strong> {formatDate(new Date())}</p>
            </div>

            <table className="table table-bordered text-center mb-3">
              <thead className="table-light">
                <tr>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine (₹)</th>
                </tr>
              </thead>
              <tbody>
                {paidBooks.map((b) => (
                  <tr key={b._id}>
                    <td>{b.book}</td>
                    <td>{formatDate(b.issueDate)}</td>
                    <td>{formatDate(b.dueDate)}</td>
                    <td>{formatDate(b.returnDate)}</td>
                    <td>{b.fine}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 className="text-end fw-bold">
              Total Paid: <FaRupeeSign /> {receiptTotal}
            </h5>

            <div className="text-center mt-4">
              <button className="btn btn-success px-4" onClick={downloadReceipt}>
                <FaDownload /> Download Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinePaymentUI;
