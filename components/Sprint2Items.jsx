"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTaskAction, updateTaskStatusAction } from "@/actions/taskActions";
import { deleteGoalAction } from "@/actions/goalActions";

function formatDate(value, timezone) {
  if (!value) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat("en-QA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(new Date(value));
}

export function TaskItems({ tasks, timezone = "Asia/Qatar", folderId = null }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleStatus(task) {
    const nextStatus = task.status === "Done" ? "Todo" : "Done";
    const result = await updateTaskStatusAction(task.id, nextStatus, folderId);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    router.refresh();
  }

  async function handleDelete(task) {
    const result = await deleteTaskAction(task.id, folderId);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    router.refresh();
  }

  if (!tasks.length) {
    return <p>No tasks yet.</p>;
  }

  return (
    <div className="item-list">
      {message && <div className="message message-error">{message}</div>}
      {tasks.map((task) => (
        <article key={task.id} className="item-row">
          <div>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <small>{formatDate(task.deadline_at, timezone)}</small>
          </div>
          <div className="item-actions">
            <span className={`status-pill ${task.status === "Done" ? "done" : ""}`}>{task.status || "Todo"}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleStatus(task)}>
              {task.status === "Done" ? "Mark Todo" : "Mark Done"}
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(task)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CompactTaskItems({ tasks, timezone = "Asia/Qatar" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleStatus(task) {
    const nextStatus = task.status === "Done" ? "Todo" : "Done";
    const result = await updateTaskStatusAction(task.id, nextStatus);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    router.refresh();
  }

  async function handleDelete(task) {
    const result = await deleteTaskAction(task.id);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    router.refresh();
  }

  if (!tasks.length) {
    return <p>No quick tasks yet.</p>;
  }

  return (
    <div className="compact-task-list">
      {message && <div className="message message-error">{message}</div>}
      {tasks.map((task) => (
        <article key={task.id} className="compact-task-row">
          <div className="compact-task-main">
            <span className={`status-pill ${task.status === "Done" ? "done" : ""}`}>
              {task.status || "Todo"}
            </span>
            <div>
              <h3>{task.title}</h3>
              <small>{formatDate(task.deadline_at, timezone)}</small>
            </div>
          </div>
          <div className="compact-task-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleStatus(task)}>
              {task.status === "Done" ? "Mark Todo" : "Mark Done"}
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(task)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
export function GoalItems({ goals, timezone = "Asia/Qatar", folderId = null }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleDelete(goal) {
    const result = await deleteGoalAction(goal.id, folderId);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    router.refresh();
  }

  if (!goals.length) {
    return <p>No goals yet.</p>;
  }

  return (
    <div className="item-list">
      {message && <div className="message message-error">{message}</div>}
      {goals.map((goal) => (
        <article key={goal.id} className="item-row">
          <div>
            <h3>{goal.title}</h3>
            {goal.description && <p>{goal.description}</p>}
            <small>{formatDate(goal.deadline_at, timezone)}</small>
          </div>
          <div className="item-actions">
            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(goal)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

