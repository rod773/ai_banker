// components/ProfilePage/DeletePopup.js
import React from "react";
import '../Popup/Popup.css';

export default function DeletePopup({ onClose }) {
  const handleDelete = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      const res = await fetch("http://localhost:8000/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully!");
        localStorage.removeItem("jwt_token");
        window.location.href = "/";
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>Are you sure you want to delete your account?</h3>
        <button onClick={handleDelete} className="btn">Yes, Delete</button>
      </div>
    </div>
  );
}
