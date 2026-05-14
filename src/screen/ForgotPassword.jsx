import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiCallWithoutAuth } from "../api/client";
import API_URLS from "../utils/apiUrls";
import logo from "../assets/logo.png";
import bgImage from "../assets/login.webp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!email) {
      setError("Please enter your registered email.");
      setSuccess("");
      return;
    }

    const response = await apiCallWithoutAuth(API_URLS.REQUEST_OTP, "POST", {
      email,
      reason: "PASSWORD_RESET",
    });

    if (response.success) {
      localStorage.setItem("forgotEmail", email);
      setError("");
      setSuccess("OTP sent to your email. Please check your inbox.");
      navigate("/forgot-password/otp");
      return;
    }

    setSuccess("");
    setError(response.message || "Failed to send OTP. Please try again.");
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="auth-form-section">
          <img src={logo} alt="NAS Telemedicine Logo" className="auth-logo" />
          
          <h2 className="auth-title">Forgot password?</h2>
          <p className="auth-subtitle">Enter your email and we'll send you a verification code to reset your password.</p>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <button onClick={handleContinue} className="btn-primary mb-6">
            Send code
          </button>

          <p className="text-center text-gray-600 text-sm">
            <Link to="/login" className="link-text">
              Back to login
            </Link>
          </p>
        </div>
    </div>
  );
};

export default ForgotPassword;
