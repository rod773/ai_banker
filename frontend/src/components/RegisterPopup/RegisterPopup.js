import React, { useState } from 'react';
import './RegisterPopup.css';
import '../Popup/Popup.css';

const questions = [
  "How important is stability over high returns?",
  "How comfortable are you with short-term swings?",
  "How focused are you on fast growth over preservation?",
  "How experienced are you with crypto investing?",
  "How much do you trust early-stage projects?",
  "How important are social/environmental goals?",
  "How much do you prefer diversification?",
  "How long are you willing to hold underperforming assets?",
  "How often do you review your portfolio?",
  "How open are you to portfolio suggestions?"
];

const RegisterPopup = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [answers, setAnswers] = useState(Array(questions.length).fill(5));

  const handleRangeChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[step - 1] = parseInt(e.target.value);
    setAnswers(newAnswers);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 0) {
      // Simple validation example
      if (!formData.username || !formData.email || !formData.password || formData.password !== formData.confirmPassword) {
        alert("Please fill out all fields correctly.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const preferences = {
        riskAversion: answers[0],
        volatilityTolerance: answers[1],
        growthFocus: answers[2],
        cryptoExperience: answers[3],
        innovationTrust: answers[4],
        impactInterest: answers[5],
        diversification: answers[6],
        holdingPatience: answers[7],
        monitoringFrequency: answers[8],
        adviceOpenness: answers[9]
      };

      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          preferences
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>&times;</button>
        {isSuccess ? (
          <div className="success-message">
            <h2>hooray!</h2>
            <p>Your account has been created successfully</p>
            <button className="btn-primary" onClick={onClose}>
              Continue
            </button>
          </div>
        ) : (
          <>
            {step === 0 ? (
              <div className="form-fields">
                <h2>Create new account</h2>
                <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleInputChange} />
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} />
              </div>
            ) : (
              <div className="step-content">
                <h2>{questions[step - 1]}</h2>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={answers[step - 1]}
                  onChange={handleRangeChange}
                  className="custom-range"
                />
              </div>
            )}
            <div className="button-group">
              {step > 0 && (
                <button className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
              )}
              <button
                className="btn-primary"
                onClick={step === questions.length ? handleSubmit : handleNext}
              >
                {step === questions.length ? 'Submit' : 'Next'}
              </button>
            </div>
            {error && <p className="error">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPopup;
