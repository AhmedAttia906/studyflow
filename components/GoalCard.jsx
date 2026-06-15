import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function GoalCard({
  goal,
  tasks,
  onEditGoal,
  onDeleteGoal,
  onCreateTask,
  onLoadTasks,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
}) {
  const totalTasks = tasks?.length || 0;

  const completedTasks =
    tasks?.filter((task) => task.status === "Done").length || 0;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="goal-card">
      <div className="goal-header">
        <div className="goal-info">
          <h3 className="goal-title">{goal.title}</h3>
          <p className="goal-description">{goal.description}</p>

          <div className="goal-progress">
            <div
              className="goal-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="goal-progress-text">
            Progress: {completedTasks}/{totalTasks} ({progress}%)
          </p>
        </div>
      </div>

      <div className="goal-actions">
        <button className="btn btn-secondary" onClick={() => onEditGoal(goal)}>
          Edit Goal
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onDeleteGoal(goal.id)}
        >
          Delete Goal
        </button>
      </div>

      <div
        style={{
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <TaskForm goalId={goal.id} onCreateTask={onCreateTask} />

        <TaskList
          goalId={goal.id}
          tasks={tasks || []}
          onCompleteTask={onCompleteTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>
  );
}
