import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import DSADashboard from "./pages/DSADashboard";
import DailyProblems from "./pages/DailyProblems";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dsa"       element={<ProtectedRoute><DSADashboard /></ProtectedRoute>} />
        <Route path="/dsa/daily" element={<ProtectedRoute><DailyProblems /></ProtectedRoute>} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        toastClassName="Toastify__toast"
      />
    </Router>
  );
}

export default App;