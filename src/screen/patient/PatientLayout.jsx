import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import logo from "../../assets/logo.png";
import "../PatientLayout.css";
import { apiCallWithAuth } from "../../api/client";
import API_URLS from "../../utils/apiUrls";
import {
  MenuIcon,
  ChartBarIcon,
  BellIcon,
  ClipboardIcon,
  DNAIcon,
  DoctorIcon,
  CalendarIcon,
  PillIcon,
  BoltIcon,
  ChatIcon,
  LinkIcon,
  CreditCardIcon,
  LogoutIcon,
} from "../../components/Icons";

const PatientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiCallWithAuth(API_URLS.GET_PROFILE, "GET");
        if (response?.success) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <ChartBarIcon className="h-5 w-5" />, path: "/patient/dashboard" },
    { id: "notifications", label: "Notifications", icon: <BellIcon className="h-5 w-5" />, path: "/patient/notifications" },
    { id: "health-logs", label: "Health Logs", icon: <ClipboardIcon className="h-5 w-5" />, path: "/patient/health-logs" },
    { id: "lab-reports", label: "Lab Reports", icon: <DNAIcon className="h-5 w-5" />, path: "/patient/lab-reports" },
    { id: "book-doctors", label: "Book Doctors", icon: <DoctorIcon className="h-5 w-5" />, path: "/patient/book-doctors" },
    { id: "appointments", label: "Appointments", icon: <CalendarIcon className="h-5 w-5" />, path: "/patient/appointments" },
    { id: "prescription", label: "Prescription", icon: <PillIcon className="h-5 w-5" />, path: "/patient/prescription" },
    { id: "ai-triage", label: "AI triage", icon: <BoltIcon className="h-5 w-5" />, path: "/patient/ai-triage" },
    { id: "messages", label: "Messages", icon: <ChatIcon className="h-5 w-5" />, path: "/patient/messages" },
    { id: "referrals", label: "Referrals", icon: <LinkIcon className="h-5 w-5" />, path: "/patient/referrals" },
    { id: "transaction-history", label: "Transaction Hist...", icon: <CreditCardIcon className="h-5 w-5" />, path: "/patient/transaction-history" },
  ];

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="patient-layout">
      {/* Mobile Menu Toggle */}
      <button
        className="sidebar-toggle md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="NAS Telemedicine" className="sidebar-logo" />
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogoutIcon className="h-5 w-5 mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="patient-main">
        <header className="patient-header">
          <div className="header-content">
            <h1 className="welcome-text">Welcome back, {profile?.firstName || "Patient"}!</h1>

            <div className="header-actions">
              <button className="notification-btn"><BellIcon className="h-5 w-5" /></button>
              <div className="profile-menu">
                <button>MW ▼</button>
              </div>
            </div>
          </div>
        </header>

        <div className="patient-content">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientLayout;
