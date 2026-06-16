"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createTaskAction } from "@/actions/taskActions";

export default function TaskForm({ folderId = "", compact = false }) {
  const formRef = useRef(null);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await createTaskAction(new FormData(e.currentTarget));

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
      return;
    }

    formRef.current?.reset();
    setMessage("Task created successfully.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card stack-form">
      <h2>{compact ? "Quick add task" : "Add task"}</h2>
      <input type="hidden" name="folder_id" value={folderId} />
      <div className="form-group">
        <label htmlFor={`task-title-${folderId || "quick"}`} className="form-label">Title</label>
        <input id={`task-title-${folderId || "quick"}`} name="title" className="form-input" required />
      </div>
      <div className="form-group">
        <label htmlFor={`task-deadline-${folderId || "quick"}`} className="form-label">Deadline</label>
        <input id={`task-deadline-${folderId || "quick"}`} name="deadline_at" type="datetime-local" className="form-input" />
      </div>
      <div className="form-group">
        <label htmlFor={`task-description-${folderId || "quick"}`} className="form-label">Description</label>
        <textarea id={`task-description-${folderId || "quick"}`} name="description" className="form-textarea" />
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create task"}
      </button>
      {message && <div className={`message ${message.includes("successfully") ? "message-success" : "message-error"}`}>{message}</div>}
    </form>
  );
}
