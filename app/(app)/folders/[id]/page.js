import { notFound } from "next/navigation";
import DeleteFolderButton from "@/components/DeleteFolderButton";
import GoalForm from "@/components/GoalForm";
import TaskForm from "@/components/TaskForm";
import { GoalItems, TaskItems } from "@/components/Sprint2Items";
import { createClient } from "@/lib/supabase/server";
import { getFolderById } from "@/repositories/foldersRepo";
import { getGoalsByFolder } from "@/repositories/goalsRepo";
import { getProfileByUserId } from "@/repositories/profilesRepo";
import { getTasksByFolder } from "@/repositories/tasksRepo";

export default async function FolderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user.id;

  const { data: folder, error: folderError } = await getFolderById(
    supabase,
    id,
    userId,
  );

  if (folderError || !folder) {
    notFound();
  }

  const [{ data: tasks = [] }, { data: goals = [] }, { data: profile }] =
    await Promise.all([
      getTasksByFolder(supabase, userId, id),
      getGoalsByFolder(supabase, userId, id),
      getProfileByUserId(supabase, userId),
    ]);

  const timezone = profile?.timezone || "Asia/Qatar";

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Folder</p>
        <h1>{folder.name}</h1>
        {folder.description && <p>{folder.description}</p>}
        <DeleteFolderButton folderId={id} />
      </section>

      <div className="two-column-layout">
        <section className="content-stack">
          <section className="card">
            <h2>Tasks</h2>
            <TaskItems tasks={tasks} timezone={timezone} folderId={id} />
          </section>
          <section className="card">
            <h2>Goals</h2>
            <GoalItems goals={goals} timezone={timezone} folderId={id} />
          </section>
        </section>
        <section className="content-stack">
          <TaskForm folderId={id} />
          <GoalForm folderId={id} />
        </section>
      </div>
    </>
  );
}

