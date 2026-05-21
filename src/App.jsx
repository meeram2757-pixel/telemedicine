import "./App.css";
import Login from "./screen/Login";
import Signup from "./screen/Signup";
import SignupRole from "./screen/SignupRole";
import SignupEmail from "./screen/SignupEmail";
import OtpVerification from "./screen/OtpVerification";
import SignupPassword from "./screen/SignupPassword";
import ForgotPassword from "./screen/ForgotPassword";
import ForgotOtp from "./screen/ForgotOtp";
import ResetPassword from "./screen/ResetPassword";
import ProfileSetup from "./screen/ProfileSetup";
import PatientLayout from "./screen/patient/PatientLayout";
import Dashboard from "./screen/patient/pages/Dashboard";
import Notifications from "./screen/patient/pages/Notifications/Notifications";
import HealthLogs from "./screen/patient/pages/HealthLog/HealthLogs";
import LabReports from "./screen/patient/pages/LabReport/LabReports";
import BookDoctors from "./screen/patient/pages/BookDoctors";
import Appointments from "./screen/patient/pages/Appointments";
import Prescription from "./screen/patient/pages/Prescription";
import AiTriage from "./screen/patient/pages/AiTriage";
import Messages from "./screen/patient/pages/Messages";
import Referrals from "./screen/patient/pages/Referrals";
import TransactionHistory from "./screen/patient/pages/TransactionHistory";
import PublicRoute from "./components/PublicRoute";
import ProfileRoute from "./components/ProfileRoute";
import ProfileCompleteRoute from "./components/ProfileCompleteRoute";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup/role" replace />} />
      <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="signup/role" element={<PublicRoute><SignupRole /></PublicRoute>} />
      <Route path="signup/email" element={<PublicRoute><SignupEmail /></PublicRoute>} />
      <Route path="signup/otp" element={<PublicRoute><OtpVerification /></PublicRoute>} />
      <Route path="signup/password" element={<PublicRoute><SignupPassword /></PublicRoute>} />
      <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="forgot-password/otp" element={<PublicRoute><ForgotOtp /></PublicRoute>} />
      <Route path="forgot-password/reset" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="profile/setup" element={<ProfileRoute><ProfileSetup /></ProfileRoute>} />
      
      {/* Patient Routes with Layout */}
      <Route element={<ProfileCompleteRoute><PatientLayout /></ProfileCompleteRoute>}>
        <Route path="patient/dashboard" element={<Dashboard />} />
        <Route path="patient/notifications" element={<Notifications />} />
        <Route path="patient/health-logs" element={<HealthLogs />} />
        <Route path="patient/lab-reports" element={<LabReports />} />
        <Route path="patient/book-doctors" element={<BookDoctors />} />
        <Route path="patient/appointments" element={<Appointments />} />
        <Route path="patient/prescription" element={<Prescription />} />
        <Route path="patient/ai-triage" element={<AiTriage />} />
        <Route path="patient/messages" element={<Messages />} />
        <Route path="patient/referrals" element={<Referrals />} />
        <Route path="patient/transaction-history" element={<TransactionHistory />} />
      </Route>

      {/* Redirect old dashboard route */}
      <Route path="dashboard" element={<Navigate to="/patient/dashboard" replace />} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;