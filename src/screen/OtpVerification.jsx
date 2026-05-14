import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiCallWithoutAuth } from "../api/client";
import API_URLS from "../utils/apiUrls";
import logo from "../assets/logo.png";
import bgImage from "../assets/login.webp";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("signupEmail");
    setEmail(storedEmail || "");
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a complete 6-digit OTP.");
      setSuccess("");
      return;
    }

    setError("");

    const response = await apiCallWithoutAuth(API_URLS.VERIFY_OTP, "POST", {
      otp: otpString,
      email,
      reason: "EMAIL_VERIFICATION",
    });

    if (response.success) {
      localStorage.setItem("signupOtp", otpString);
      setSuccess("OTP verified. Continue to set your password.");
      navigate("/signup/password");
      return;
    }

    setError(response.message || "OTP verification failed. Please try again.");
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="auth-form-section">
          <img src={logo} alt="NAS Telemedicine Logo" className="auth-logo" />
          
          <h2 className="auth-title">Enter the 6-digit code</h2>
          <p className="auth-subtitle">sent to your email</p>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                inputMode="numeric"
              />
            ))}
          </div>

          <button onClick={handleVerify} className="btn-primary mb-6">
            Verify
          </button>

          <p className="text-center text-gray-600 text-sm">
            Didn't receive the code?{" "}
            <Link to="/signup/email" className="link-text">
              Resend code
            </Link>
          </p>
        </div>
    </div>
  );
};

export default OtpVerification;
