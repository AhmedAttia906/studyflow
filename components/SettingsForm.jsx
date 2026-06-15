"use client";

import { useState } from "react";
import { logoutUser } from "@/actions/authActions";
import { saveSettingsAction } from "@/actions/settingsActions";

export default function SettingsForm({ email, settings }) {
  const [theme, setTheme] = useState(settings?.theme || "system");
  const [weekStart, setWeekStart] = useState(settings?.week_start || "saturday");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    const result = await saveSettingsAction({
      theme,
      week_start: weekStart,
    });

    if (result.error) {
      setMessage(result.error);
      setMessageType("error");
      setLoading(false);
      return;
    }

    setMessage("Settings saved successfully.");
    setMessageType("success");
    setLoading(false);
  }

  async function handleLogout() {
    setMessage("");
    setMessageType("");
    setLoading(true);

    const result = await logoutUser();

    if (result.error) {
      setMessage(result.error);
      setMessageType("error");
      setLoading(false);
      return;
    }

    window.location.href = "/login";
  }

  return (
    <div className="settings-grid">
      <form onSubmit={handleSave} className="card settings-card">
        <div className="form-group">
          <label className="form-label">Email</label>
          <p className="settings-email">{email}</p>
        </div>

        <div className="form-group">
          <label htmlFor="theme" className="form-label">
            Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="form-input"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="week_start" className="form-label">
            Week starts on
          </label>
          <select
            id="week_start"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="form-input"
          >
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save settings"}
        </button>

        {message && (
          <div
            className={`message ${
              messageType === "success" ? "message-success" : "message-error"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <section className="card settings-card">
        <h2>Account</h2>
        <p>Password changes will be added in a later sprint.</p>
        <button type="button" className="btn btn-secondary" disabled>
          Change Password
        </button>
        <button
          type="button"
          className="btn btn-danger"
          disabled={loading}
          onClick={handleLogout}
        >
          Logout
        </button>
      </section>
    </div>
  );
}
