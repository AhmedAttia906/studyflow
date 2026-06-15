export default function EditGoalModal({
  isOpen,
  selectedGoal,
  editTitle,
  editDescription,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onClose,
}) {
  if (!isOpen || !selectedGoal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Goal</h2>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Title
            </label>
            <input
              id="edit-title"
              value={editTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description" className="form-label">
              Description
            </label>
            <textarea
              id="edit-description"
              value={editDescription}
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
