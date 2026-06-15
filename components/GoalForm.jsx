export default function GoalForm({ onCreateGoal }) {
  return (
    <section className="card">
      <h2>Create a New Goal</h2>

      <form onSubmit={onCreateGoal} className="auth-form">
        <div className="form-group">
          <label htmlFor="goal-title" className="form-label">
            Goal Title
          </label>
          <input
            id="goal-title"
            name="title"
            placeholder="e.g., Complete React Course"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal-description" className="form-label">
            Description
          </label>
          <textarea
            id="goal-description"
            name="description"
            placeholder="Describe your goal in detail..."
            className="form-textarea"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          Create Goal
        </button>
      </form>
    </section>
  );
}
