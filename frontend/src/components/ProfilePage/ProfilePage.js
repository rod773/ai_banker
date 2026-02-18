import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import DeletePopup from '../DeletePopup/DeletePopup';
import UpdateEmailPopup from '../UpdateEmailPopup/UpdateEmailPopup';
import UpdatePasswordPopup from '../UpdatePasswordPopup/UpdatePasswordPopup';

function ProfilePage() {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [preferences, setPreferences] = useState({
    riskAversion: 5,
    volatilityTolerance: 5,
    growthFocus: 5,
    cryptoExperience: 5,
    innovationTrust: 5,
    impactInterest: 5,
    diversification: 5,
    holdingPatience: 5,
    monitoringFrequency: 5,
    adviceOpenness: 5
  });

  const handlePreferenceChange = (preference, value) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: value
    }));
  };

  const handleSavePreferences = async () => {
    try {
      const response = await fetch('/api/auth/updatePreferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          ...preferences
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        alert('Preferences updated successfully!');
      }
    } catch (error) {
      alert('Failed to update preferences');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ←
        </button>
        <h1>About you</h1>
      </div>
      <div className="preferences-section">
        <h2>Investment Preferences</h2>
        <div className="preferences-grid">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="preference-item">
              <label>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => handlePreferenceChange(key, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSavePreferences} className="btn">
          Save Preferences
        </button>
      </div>

      <div className="account-section">
        <h2>Account Settings</h2>
        <div className="account-buttons">
          <button onClick={() => setShowEmailPopup(true)} className="btn">
            Update Email
          </button>
          <button onClick={() => setShowPasswordPopup(true)} className="btn">
            Update Password
          </button>
          <button onClick={() => setShowDeletePopup(true)} className="btn delete-btn">
            Delete My Account
          </button>
        </div>
      </div>

      {showEmailPopup && (
        <UpdateEmailPopup
          onClose={() => setShowEmailPopup(false)}
          onSuccess={(message) => {
            alert('Email updated successfully!');
            setShowEmailPopup(false);
          }}
        />
      )}

      {showPasswordPopup && (
        <UpdatePasswordPopup
          onClose={() => setShowPasswordPopup(false)}
          onSuccess={(message) => {
            alert('Password updated successfully!');
            setShowPasswordPopup(false);
          }}
        />
      )}

      {showDeletePopup && (
        <DeletePopup
          onClose={() => setShowDeletePopup(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;