export default function EditTaskModal({
  isOpen,
  selectedTask,
  editTaskTitle,
  editTaskDescription,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onClose,
}) {
  if (!isOpen || !selectedTask) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Task</h2>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="edit-task-title" className="form-label">
              Title
            </label>
            <input
              id="edit-task-title"
              value={editTaskTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-description" className="form-label">
              Description
            </label>
            <textarea
              id="edit-task-description"
              value={editTaskDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="form-textarea"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onSave} className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
