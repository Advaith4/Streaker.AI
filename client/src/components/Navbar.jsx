import { Link, useNavigate, useLocation } from "react-router-dom";
import { Flame, LayoutDashboard, Target, User, LogOut } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const token = localStorage.getItem("token");
  let initials = "?";
  let email = "";
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      initials = (decoded.name || decoded.email || "U")[0].toUpperCase();
      email = decoded.email || "";
    } catch (_) {}
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/dsa" && (pathname === "/dsa" || pathname === "/dsa/daily")) return true;
    return pathname === path;
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = isActive(to);
    return (
      <Link 
        to={to} 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          textDecoration: "none",
          padding: "0.5rem 1rem",
          borderRadius: "10px",
          color: active ? "#f8fafc" : "#94a3b8",
          background: active ? "rgba(255, 255, 255, 0.08)" : "transparent",
          fontWeight: active ? 600 : 500,
          fontSize: "0.9rem",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.color = "#e2e8f0";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <Icon size={18} strokeWidth={active ? 2.5 : 2} color={active ? (to === '/dashboard' ? '#60a5fa' : to === '/dsa' ? '#10b981' : '#c084fc') : "currentColor"} />
        {label}
      </Link>
    );
  };

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 2rem",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
    }}>
      {/* Brand */}
      <Link to="/dashboard" style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        textDecoration: "none",
        fontWeight: 800,
        fontSize: "1.25rem",
        letterSpacing: "-0.03em"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(245, 158, 11, 0.3)"
        }}>
          <Flame size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ 
          background: "linear-gradient(to right, #f8fafc, #94a3b8)", 
          WebkitBackgroundClip: "text", 
          WebkitTextFillColor: "transparent" 
        }}>
          Streaker.ai
        </span>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/dsa" icon={Target} label="DSA Tracker" />
        <NavItem to="/profile" icon={User} label="Profile" />
        
        <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)", margin: "0 0.75rem" }} />

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.background = "rgba(248, 113, 113, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={16} />
          Logout
        </button>

        <div 
          title={email} 
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #818cf8, #c084fc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "0.9rem",
            marginLeft: "0.5rem",
            boxShadow: "0 2px 10px rgba(139, 92, 246, 0.3)",
            border: "2px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          {initials}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
