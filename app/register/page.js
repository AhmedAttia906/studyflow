"use client";

import { useState } from "react";
import { registerUser, signInWithGoogle } from "@/actions/authActions";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    const result = await registerUser(email, password);

    if (result.error) {
      setMessage(result.error);
      setMessageType("error");
      setLoading(false);
      return;
    }

    setMessage("Account created successfully. Check your email or login.");
    setMessageType("success");
    setEmail("");
    setPassword("");
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setMessage("");
    setMessageType("");
    setLoading(true);

    const result = await signInWithGoogle();

    if (result.error) {
      setMessage(result.error);
      setMessageType("error");
      setLoading(false);
      return;
    }

    window.location.href = result.url;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              minLength={6}
              required
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "8px" }}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          className="btn btn-secondary btn-lg auth-submit auth-oauth"
          disabled={loading}
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </button>

        {message && (
          <div
            className={`message ${messageType === "success" ? "message-success" : "message-error"}`}
            style={{ marginTop: "16px" }}
          >
            {message}
          </div>
        )}

        <div className="auth-link">
          Already have an account? <Link href="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
