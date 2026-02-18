import React, { useState } from "react";
import '../Popup/Popup.css';

export default function UpdateEmailPopup({ onClose, onSuccess }) {
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState("");

    const handleUpdateEmail = async () => {
        try {
            const response = await fetch("http://localhost:8000/auth/updateEmail", {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    username: localStorage.getItem('username'),
                    newEmail 
                }),
            });

            const data = await response.json();
            if (response.ok && data.status === 200) {
                onSuccess(data.data.message);
                onClose();
            } else {
                setError(data.error?.message || "Email update failed");
            }
        } catch (err) {
            setError("Server error: " + err.message);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Update Email</h2>
                <input
                    type="email"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <button className="btn" onClick={handleUpdateEmail}>
                    Update Email
                </button>
            </div>
        </div>
    );
}