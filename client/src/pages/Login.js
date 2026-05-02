import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back! 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/google", { 
        credential: credentialResponse.credential 
      });
      localStorage.setItem("token", res.data.token);
      if (res.data.isNewUser) {
        toast.success("Welcome to Streaker.ai! 🎉");
      } else {
        toast.success("Welcome back! 🚀");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Login Failed");
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login Failed");
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeUp">
        <div className="auth-logo">
          <div className="auth-logo-icon">🔥</div>
          <span className="auth-logo-text">Streaker.ai</span>
        </div>

        <h2>Sign In</h2>
        <p className="subtitle">Build your streak. Master DSA. Every day.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group animate-fadeUp delay-1">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group animate-fadeUp delay-2">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn-primary animate-fadeUp delay-3"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="animate-fadeUp delay-3" style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--muted)', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <div className="animate-fadeUp delay-4" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            shape="rectangular"
            text="continue_with"
            width="100%"
          />
        </div>

        <p className="auth-footer animate-fadeUp delay-4">
          Don't have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;