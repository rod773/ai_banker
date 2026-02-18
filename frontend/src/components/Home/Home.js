import React, { useState, useEffect } from "react";
import LoginPopup from "../LoginPopup/LoginPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './Home.css';
import accountingOfficeImage from '../../assets/images/accounting-office.png';
import nycSkylineImage from '../../assets/images/nyc-skyline.png';
import businessmenHandshakeImage from '../../assets/images/businessmen-handshake.png';
import logoImage from '../../assets/images/Logo.png';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('jwt_token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        localStorage.removeItem('jwt_token');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('jwt_token', token);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
  };

  const goToProfile = () => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    setShowLogin(true);
    return;
  }
  navigate('/profile');
};

  const goToReport = () => {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    setShowLogin(true);
    return;
  }
  navigate('/report');
};

  return (
    <div className="landing-page">
      <header className="header">
        <img src={logoImage} alt="My Banker" className="logo" />
        <nav>
          <ul className="nav-list">
            {!isAuthenticated ? (
              <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => setShowLogin(true)}>
                <FontAwesomeIcon icon={faUserCircle} />
                Login
              </li>
            ) : (
              <>
                <li className="nav-item" title="Profile" style={{ cursor: 'pointer' }} onClick={goToProfile}>
                  <FontAwesomeIcon icon={faUserCircle} size="2x" />
                </li>
                <li className="nav-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      <section className="hero-section">
        <div className="hero-text">
          <h2>Your Financial Future Starts Here</h2>
          <p>Upload your crypto wallet address and get a professional, personalized financial report – crafted as if by your own private banker.</p>
          <p>Let's shape a brighter financial future, together. Let us help you make the right decisions with tailored insights you can trust.</p>
          <button className="btn" onClick={goToReport}>Get Your Report</button>
        </div>
        <div className="hero-image">
          <img src={accountingOfficeImage} alt="Private Banker" />
        </div>
      </section>

      <section className="image-strip">
        <div className="image-quote-pair">
          <img src={nycSkylineImage} alt="NYC Skyline" />
          <div className="quote-content">
            <h3>Professional Excellence</h3>
            <p>With decades of experience in traditional finance and blockchain technology, we bring Wall Street expertise to your crypto investments. Our analysis combines time-tested financial principles with cutting-edge blockchain analytics.</p>
          </div>
        </div>
        <div className="image-quote-pair">
          <img src={businessmenHandshakeImage} alt="Handshake" />
          <div className="quote-content">
            <h3>Trust & Reliability</h3>
            <p>We believe in building lasting relationships through transparency and reliability. Our automated analysis provides the same level of insight you'd expect from a private banking relationship, available 24/7.</p>
          </div>
        </div>
      </section>

      <section className="call-to-action">
        <h3>One Simple Step. Endless Financial Clarity.</h3>
        <p>Banker Expert is the easiest way to understand your crypto portfolio. Whether you're managing assets or exploring investments, our report gives you the insights you need.</p>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Banker Expert. All rights reserved.
      </footer>
    </div>
  );
}
