"use client";

import { useState } from "react";
import { loginUser, signInWithGoogle } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("error") || "";
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await loginUser(email, password);

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    setMessage("");
    setLoading(true);

    const result = await signInWithGoogle();

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
      return;
    }

    window.location.href = result.url;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">StudyFlow</h1>

        <form onSubmit={handleLogin} className="auth-form">
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
            {loading ? "Logging in..." : "Sign In"}
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
          <div className="message message-error" style={{ marginTop: "16px" }}>
            {message}
          </div>
        )}

        <div className="auth-link">
          Don&apos;t have an account? <Link href="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
}
