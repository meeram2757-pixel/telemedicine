import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiCallWithoutAuth } from "../api/client";
import API_URLS from "../utils/apiUrls";
import logo from "../assets/logo.png";
import bgImage from "../assets/login.webp";

const SignupEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const provider = localStorage.getItem("signupProvider");
    if (!provider) {
      navigate("/signup/role");
    }
  }, [navigate]);

  const handleContinue = async () => {
    if (!email) {
      setError("Please enter your email address.");
      setSuccess("");
      return;
    }

    setError("");

    // First, call /signup to validate email and role
    const provider = localStorage.getItem("signupProvider");
    
    const signupResponse = await apiCallWithoutAuth(API_URLS.SIGNUP, "POST", {
      email,
      role: provider,
      provider: "EMAIL",
    });

    if (!signupResponse.success) {
      const errorMessage = signupResponse.message?.toLowerCase() || "";
      
      if (errorMessage.includes("already exists") || errorMessage.includes("already registered")) {
        setError("This email is already registered. Please use a different email or try logging in.");
      } else if (errorMessage.includes("invalid email") || errorMessage.includes("valid email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(signupResponse.message || "Failed to register. Please try again.");
      }
      return;
    }

    // If signup successful, request OTP
    const otpResponse = await apiCallWithoutAuth(API_URLS.REQUEST_OTP, "POST", {
      email,
      reason: "EMAIL_VERIFICATION",
    });

    if (otpResponse.success) {
      localStorage.setItem("signupEmail", email);
      setSuccess("OTP sent to your email. Please check your inbox.");
      navigate("/signup/otp");
      return;
    }

    setError(otpResponse.message || "Failed to send OTP. Please try again.");
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="auth-form-section">
          <img src={logo} alt="NAS Telemedicine Logo" className="auth-logo" />
          
          <h2 className="auth-title">Sign up</h2>
          <p className="auth-subtitle">Enter your email address to get started.</p>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <button onClick={handleContinue} className="btn-primary mb-6">
            Continue
          </button>

          <div className="divider-line">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="divider-line-text">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button className="btn-outline mb-8">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link-text">
              Log in
            </Link>
          </p>
        </div>
    </div>
  );
};

export default SignupEmail;
