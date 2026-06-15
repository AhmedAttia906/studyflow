export default function TaskForm({ goalId, onCreateTask }) {
  return (
    <div className="card" style={{ marginBottom: "24px" }}>
      <h3>Add a New Task to This Goal</h3>

      <form onSubmit={(e) => onCreateTask(e, goalId)} className="auth-form">
        <div className="form-group">
          <label htmlFor={`task-title-${goalId}`} className="form-label">
            Task Title
          </label>
          <input
            id={`task-title-${goalId}`}
            name="title"
            placeholder="e.g., Complete Chapter 5"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor={`task-description-${goalId}`} className="form-label">
            Description
          </label>
          <textarea
            id={`task-description-${goalId}`}
            name="description"
            placeholder="Describe what you need to do..."
            className="form-textarea"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>
    </div>
  );
}
