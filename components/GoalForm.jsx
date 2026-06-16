"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createGoalAction } from "@/actions/goalActions";

export default function GoalForm({ folderId = "" }) {
  const formRef = useRef(null);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await createGoalAction(new FormData(e.currentTarget));

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
      return;
    }

    formRef.current?.reset();
    setMessage("Goal created successfully.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card stack-form">
      <h2>Add goal</h2>
      <input type="hidden" name="folder_id" value={folderId} />
      <div className="form-group">
        <label htmlFor={`goal-title-${folderId}`} className="form-label">Title</label>
        <input id={`goal-title-${folderId}`} name="title" className="form-input" required />
      </div>
      <div className="form-group">
        <label htmlFor={`goal-deadline-${folderId}`} className="form-label">Deadline</label>
        <input id={`goal-deadline-${folderId}`} name="deadline_at" type="datetime-local" className="form-input" />
      </div>
      <div className="form-group">
        <label htmlFor={`goal-description-${folderId}`} className="form-label">Description</label>
        <textarea id={`goal-description-${folderId}`} name="description" className="form-textarea" />
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create goal"}
      </button>
      {message && <div className={`message ${message.includes("successfully") ? "message-success" : "message-error"}`}>{message}</div>}
    </form>
  );
}
