import { useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/signup", { name, email, password, role: "user" });
      toast.success("Account created! Please sign in 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
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
        toast.success("Account created successfully! 🎉");
      } else {
        toast.success("Welcome back! 🚀");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Signup Failed");
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Signup Failed");
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeUp">
        <div className="auth-logo">
          <div className="auth-logo-icon">🔥</div>
          <span className="auth-logo-text">Streaker.ai</span>
        </div>

        <h2>Create Account</h2>
        <p className="subtitle">Start your DSA journey today.</p>

        <form onSubmit={handleSignup}>
          <div className="form-group animate-fadeUp delay-1">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              placeholder="Advaith G"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group animate-fadeUp delay-2">
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

          <div className="form-group animate-fadeUp delay-3">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn-primary animate-fadeUp delay-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div className="animate-fadeUp delay-4" style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--muted)', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <div className="animate-fadeUp delay-5" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            shape="rectangular"
            text="signup_with"
            width="100%"
          />
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;