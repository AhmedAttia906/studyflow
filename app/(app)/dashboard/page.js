import Link from "next/link";
import TaskForm from "@/components/TaskForm";
import { CompactTaskItems } from "@/components/Sprint2Items";
import { createClient } from "@/lib/supabase/server";
import { getUpcomingCalendarEvents } from "@/repositories/calendarEventsRepo";
import { getFolders } from "@/repositories/foldersRepo";
import { getProfileByUserId } from "@/repositories/profilesRepo";
import { getGoals } from "@/repositories/goalsRepo";
import { getTasks, getTasksWithoutFolder } from "@/repositories/tasksRepo";

function formatEventTime(value, timezone) {
  return new Intl.DateTimeFormat("en-QA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const [
    { data: profile },
    { data: events = [] },
    { data: folders = [] },
    { data: quickTasks = [] },
    { data: tasks = [] },
    { data: goals = [] },
  ] = await Promise.all([
    getProfileByUserId(supabase, user.id),
    getUpcomingCalendarEvents(supabase, user.id, 6),
    getFolders(supabase, user.id),
    getTasksWithoutFolder(supabase, user.id),
    getTasks(supabase, user.id),
    getGoals(supabase, user.id),
  ]);

  const timezone = profile?.timezone || "Asia/Qatar";
  const displayName = profile?.display_name || "there";
  const todoTasks = tasks.filter((task) => task.status !== "Done");
  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  const visibleEvents = events.filter((event) => {
    if (event.source_type !== "task") {
      return true;
    }

    const sourceTask = tasksById.get(event.source_id);
    return sourceTask && sourceTask.status !== "Done";
  });
  const today = new Intl.DateTimeFormat("en-QA", {
    dateStyle: "full",
    timeZone: timezone,
  }).format(new Date());

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome, {displayName}</h1>
        <p>Today is {today}.</p>
      </section>

      <section className="dashboard-stats-grid">
        <div className="stat-card dashboard-stat-card">
          <div className="stat-label">Tasks</div>
          <div className="stat-value">{todoTasks.length}</div>
        </div>
        <div className="stat-card dashboard-stat-card">
          <div className="stat-label">Goals</div>
          <div className="stat-value">{goals.length}</div>
        </div>
        <div className="stat-card dashboard-stat-card">
          <div className="stat-label">Folders</div>
          <div className="stat-value">{folders.length}</div>
        </div>
      </section>

      <div className="dashboard-overview-layout">
        <section className="content-stack">
          <section className="card dashboard-panel">
            <h2>Upcoming deadlines</h2>
            {visibleEvents.length === 0 ? (
              <p>No upcoming deadlines.</p>
            ) : (
              <div className="item-list">
                {visibleEvents.map((event) => (
                  <article key={event.id} className="item-row compact">
                    <div>
                      <h3>{event.title}</h3>
                      <small>{formatEventTime(event.event_time, timezone)}</small>
                    </div>
                    <span className="status-pill">{event.source_type}</span>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="card dashboard-panel compact-panel">
            <h2>Quick tasks</h2>
            <CompactTaskItems tasks={quickTasks.slice(0, 6)} timezone={timezone} />
          </section>

          <section className="card dashboard-panel compact-panel">
            <h2>Folders quick access</h2>
            {folders.length === 0 ? (
              <p>No folders yet.</p>
            ) : (
              <div className="quick-actions">
                {folders.slice(0, 6).map((folder) => (
                  <Link key={folder.id} href={`/folders/${folder.id}`} className="quick-action mini-card">
                    {folder.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </section>

        <section className="dashboard-quick-add">
          <TaskForm compact />
        </section>
      </div>
    </>
  );
}



