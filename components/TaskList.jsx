export default function TaskList({
  goalId,
  tasks,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
}) {
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <p style={{ margin: 0, color: "var(--text-dark)" }}>
          No tasks yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.status === "Done" ? "completed" : ""}`}
        >
          <div className="task-header">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.status === "Done"}
              onChange={() =>
                onCompleteTask(
                  task.id,
                  task.status === "Done" ? "Todo" : "Done",
                  goalId,
                )
              }
              aria-label={`Mark "${task.title}" as ${task.status === "Done" ? "incomplete" : "complete"}`}
            />
            <div className="task-info">
              <p className="task-title">{task.title}</p>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <span
                className={`task-status ${
                  task.status === "Done" ? "completed" : ""
                }`}
              >
                {task.status}
              </span>

              {task.done_at && (
                <div className="task-date">
                  Completed:{" "}
                  {new Date(task.done_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="task-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onEditTask(task)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDeleteTask(task.id, goalId)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
