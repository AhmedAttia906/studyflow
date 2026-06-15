"use client";

import { useEffect, useState } from "react";
import {
  createGoalAction,
  getGoalsAction,
  deleteGoalAction,
  updateGoalAction,
} from "@/actions/goalActions";
import { logoutUser } from "@/actions/authActions";
import Navbar from "@/components/Navbar";
import {
  createTaskAction,
  getTasksByGoalAction,
  completeTaskAction,
  deleteTaskAction,
  updateTaskAction,
  getTasksAction,
} from "@/actions/taskActions";
import GoalForm from "@/components/GoalForm";
import GoalCard from "@/components/GoalCard";
import EditGoalModal from "@/components/EditGoalModal";
import EditTaskModal from "@/components/EditTaskModal";
import DashboardStats from "@/components/DashboardStats";

export default function DashboardClient({ email }) {
  const [message, setMessage] = useState("");
  const [goals, setGoals] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskGoalId, setSelectedTaskGoalId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [tasksByGoal, setTasksByGoal] = useState({});
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    async function loadInitialData() {
      const goalsResult = await getGoalsAction();

      if (goalsResult.success) {
        setGoals(goalsResult.goals);

        const nextTasksByGoal = {};

        for (const goal of goalsResult.goals) {
          const tasksResult = await getTasksByGoalAction(goal.id);

          if (tasksResult.success) {
            nextTasksByGoal[goal.id] = tasksResult.tasks;
          }
        }

        setTasksByGoal(nextTasksByGoal);
      }

      const tasksResult = await getTasksAction();

      if (tasksResult.success) {
        setAllTasks(tasksResult.tasks);
      }
    }

    loadInitialData();
  }, []);

  async function handleLogout() {
    const result = await logoutUser();

    if (result.error) {
      setMessage(result.error);
      return;
    }

    window.location.href = "/login";
  }

  async function handleCreateGoal(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const result = await createGoalAction(formData);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Goal created successfully.");
    await loadGoals();
    e.target.reset();
  }

  async function handleUpdateGoal() {
    const result = await updateGoalAction(
      selectedGoal.id,
      editTitle,
      editDescription,
    );

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Goal updated successfully.");
    setIsEditOpen(false);
    setSelectedGoal(null);
    await loadGoals();
  }

  function openEditModal(goal) {
    setSelectedGoal(goal);
    setEditTitle(goal.title);
    setEditDescription(goal.description || "");
    setIsEditOpen(true);
  }

  async function handleDeleteGoal(id) {
    const result = await deleteGoalAction(id);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Goal deleted successfully.");
    await loadGoals();
  }

  async function loadGoals() {
    const result = await getGoalsAction();

    if (result.success) {
      setGoals(result.goals);

      for (const goal of result.goals) {
        await loadTasksForGoal(goal.id);
      }
    }
  }

  async function loadAllTasks() {
    const result = await getTasksAction();

    if (result.success) {
      setAllTasks(result.tasks);
    }
  }

  async function loadTasksForGoal(goalId) {
    const result = await getTasksByGoalAction(goalId);

    if (result.success) {
      setTasksByGoal((prev) => ({
        ...prev,
        [goalId]: result.tasks,
      }));
    }
  }

  async function handleCompleteTask(taskId, goalId, currentStatus) {
    const nextStatus = currentStatus === "Done" ? "Todo" : "Done";
    const result = await completeTaskAction(taskId, nextStatus);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage(
      nextStatus === "Done"
        ? "Task completed successfully."
        : "Task moved back to todo.",
    );
    await loadTasksForGoal(goalId);
    await loadAllTasks();
  }

  async function handleDeleteTask(taskId, goalId) {
    const result = await deleteTaskAction(taskId);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Task deleted successfully.");
    await loadTasksForGoal(goalId);
    await loadAllTasks();
  }

  function openTaskEditModal(task, goalId) {
    setSelectedTask(task);
    setSelectedTaskGoalId(goalId);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setIsTaskEditOpen(true);
  }

  async function handleUpdateTask() {
    if (!selectedTask) {
      return;
    }

    const result = await updateTaskAction(
      selectedTask.id,
      editTaskTitle,
      editTaskDescription,
    );

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Task updated successfully.");
    setIsTaskEditOpen(false);
    setSelectedTask(null);
    setSelectedTaskGoalId(null);
    await loadTasksForGoal(selectedTaskGoalId);
    await loadAllTasks();
  }

  async function handleCreateTask(e, goalId) {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("goal_id", goalId);

    const result = await createTaskAction(formData);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    await loadTasksForGoal(goalId);
    await loadAllTasks();
    setMessage("Task created successfully.");
    e.target.reset();
  }

  return (
    <main>
      <Navbar email={email} onLogout={handleLogout} />

      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "message-success" : "message-error"
          }`}
        >
          {message}
        </div>
      )}

      <DashboardStats goals={goals} tasks={allTasks} />

      <section className="goals-section">
        <h2>Your Goals</h2>

        {goals.length === 0 ? (
          <div className="card">
            <p style={{ margin: 0, color: "var(--text-dark)" }}>
              No goals yet. Create your first goal to get started!
            </p>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              tasks={tasksByGoal[goal.id]}
              onEditGoal={openEditModal}
              onDeleteGoal={handleDeleteGoal}
              onCreateTask={handleCreateTask}
              onLoadTasks={loadTasksForGoal}
              onCompleteTask={handleCompleteTask}
              onEditTask={openTaskEditModal}
              onDeleteTask={handleDeleteTask}
            />
          ))
        )}
      </section>

      <section>
        <GoalForm onCreateGoal={handleCreateGoal} />
      </section>

      <EditGoalModal
        isOpen={isEditOpen}
        selectedGoal={selectedGoal}
        editTitle={editTitle}
        editDescription={editDescription}
        onTitleChange={setEditTitle}
        onDescriptionChange={setEditDescription}
        onSave={handleUpdateGoal}
        onClose={() => setIsEditOpen(false)}
      />

      <EditTaskModal
        isOpen={isTaskEditOpen}
        selectedTask={selectedTask}
        editTaskTitle={editTaskTitle}
        editTaskDescription={editTaskDescription}
        onTitleChange={setEditTaskTitle}
        onDescriptionChange={setEditTaskDescription}
        onSave={handleUpdateTask}
        onClose={() => setIsTaskEditOpen(false)}
      />
    </main>
  );
}
