"use client";

import { useState } from "react";
import { saveProfileAction } from "@/actions/profileActions";

export default function ProfileForm({ profile }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [timezone, setTimezone] = useState(profile?.timezone || "Asia/Qatar");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    const result = await saveProfileAction({
      display_name: displayName,
      username,
      bio,
      timezone,
    });

    if (result.error) {
      setMessage(result.error);
      setMessageType("error");
      setLoading(false);
      return;
    }

    setMessage("Profile saved successfully.");
    setMessageType("success");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card profile-form">
      <div className="form-group">
        <label htmlFor="display_name" className="form-label">
          Display name
        </label>
        <input
          id="display_name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="form-input"
          placeholder="Your name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
          placeholder="studyflow_user"
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio" className="form-label">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="form-textarea"
          placeholder="A short note about you"
        />
      </div>

      <div className="form-group">
        <label htmlFor="timezone" className="form-label">
          Timezone
        </label>
        <input
          id="timezone"
          type="text"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="form-input"
          placeholder="Asia/Qatar"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save profile"}
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
  );
}
