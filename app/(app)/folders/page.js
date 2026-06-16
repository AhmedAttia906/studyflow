import Link from "next/link";
import FolderForm from "@/components/FolderForm";
import { createClient } from "@/lib/supabase/server";
import { getFolders } from "@/repositories/foldersRepo";

export default async function FoldersPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: folders = [] } = await getFolders(supabase, userData.user.id);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Folders</p>
        <h1>Folders</h1>
        <p>Organize tasks and goals when a project needs its own space.</p>
      </section>

      <div className="two-column-layout">
        <section>
          <h2>Your folders</h2>
          <div className="folder-grid">
            {folders.length === 0 ? (
              <div className="card"><p>No folders yet.</p></div>
            ) : (
              folders.map((folder) => (
                <Link key={folder.id} href={`/folders/${folder.id}`} className="card folder-card">
                  <h3>{folder.name}</h3>
                  <p>{folder.description || "No description yet."}</p>
                </Link>
              ))
            )}
          </div>
        </section>
        <FolderForm />
      </div>
    </>
  );
}
