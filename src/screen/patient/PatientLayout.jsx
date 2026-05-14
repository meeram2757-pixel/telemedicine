import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import logo from "../../assets/logo.png";
import "../PatientLayout.css";

const PatientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/patient/dashboard" },
    { id: "notifications", label: "Notifications", icon: "🔔", path: "/patient/notifications" },
    { id: "health-logs", label: "Health Logs", icon: "📋", path: "/patient/health-logs" },
    { id: "lab-reports", label: "Lab Reports", icon: "🧬", path: "/patient/lab-reports" },
    { id: "book-doctors", label: "Book Doctors", icon: "👨‍⚕️", path: "/patient/book-doctors" },
    { id: "appointments", label: "Appointments", icon: "📅", path: "/patient/appointments" },
    { id: "prescription", label: "Prescription", icon: "💊", path: "/patient/prescription" },
    { id: "ai-triage", label: "AI triage", icon: "⚡", path: "/patient/ai-triage" },
    { id: "messages", label: "Messages", icon: "💬", path: "/patient/messages" },
    { id: "referrals", label: "Referrals", icon: "🔗", path: "/patient/referrals" },
    { id: "transaction-history", label: "Transaction Hist...", icon: "💳", path: "/patient/transaction-history" },
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
        ☰
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
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="patient-main">
        <header className="patient-header">
          <div className="header-content">
            <h1 className="welcome-text">Welcome back!</h1>
            <div className="header-actions">
              <button className="notification-btn">🔔</button>
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
