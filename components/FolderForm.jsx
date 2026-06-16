"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createFolderAction } from "@/actions/folderActions";

export default function FolderForm() {
  const formRef = useRef(null);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await createFolderAction(new FormData(e.currentTarget));

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
      return;
    }

    formRef.current?.reset();
    setMessage("Folder created successfully.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card stack-form">
      <h2>Create folder</h2>
      <div className="form-group">
        <label htmlFor="folder-name" className="form-label">Name</label>
        <input id="folder-name" name="name" className="form-input" required />
      </div>
      <div className="form-group">
        <label htmlFor="folder-description" className="form-label">Description</label>
        <textarea id="folder-description" name="description" className="form-textarea" />
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create folder"}
      </button>
      {message && <div className={`message ${message.includes("successfully") ? "message-success" : "message-error"}`}>{message}</div>}
    </form>
  );
}
