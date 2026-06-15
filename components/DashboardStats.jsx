export default function DashboardStats({ goals, tasks }) {
  const totalGoals = goals.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const pendingTasks = totalTasks - completedTasks;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <section className="stats-section">
      <h2>Dashboard Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Goals</div>
          <div className="stat-value">{totalGoals}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{totalTasks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completed Tasks</div>
          <div className="stat-value">{completedTasks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pending Tasks</div>
          <div className="stat-value">{pendingTasks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completion Rate</div>
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
