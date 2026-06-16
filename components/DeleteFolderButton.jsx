"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteFolderAction } from "@/actions/folderActions";

export default function DeleteFolderButton({ folderId }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this folder and all tasks, goals, and related calendar events inside it?",
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setLoading(true);

    const result = await deleteFolderAction(folderId);

    if (result.error) {
      setMessage(result.error);
      setLoading(false);
      return;
    }

    router.push("/folders");
    router.refresh();
  }

  return (
    <div className="delete-folder-panel">
      <button
        type="button"
        className="btn btn-danger"
        disabled={loading}
        onClick={handleDelete}
      >
        {loading ? "Deleting..." : "Delete Folder"}
      </button>
      {message && <div className="message message-error">{message}</div>}
    </div>
  );
}
