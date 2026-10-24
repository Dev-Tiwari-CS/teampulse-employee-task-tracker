import { useEffect, useRef, useState } from 'react';

const STATUSES = [
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
];

/**
 * Create/Edit task modal for admins.
 * @param {object|null} task       - existing task when editing, null when creating
 * @param {array}       employees  - list of {id, name} for the assignee dropdown
 * @param {function}    onClose    - called when the modal should close
 * @param {function}    onSubmit   - called with the payload; may throw to show an error
 */
export default function TaskModal({ task, employees, onClose, onSubmit }) {
  const isEdit = Boolean(task);
  const firstFieldRef = useRef(null);

  const [form, setForm] = useState({
    title:       '',
    description: '',
    assigned_to: '',
    status:      'pending',
    due_date:    '',
  });
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title || '',
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        status:      task.status || 'pending',
        due_date:    task.due_date ? task.due_date.slice(0, 10) : '',
      });
    }
  }, [task]);

  // Focus first field on mount
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required.');
    if (!isEdit && !form.assigned_to) return setError('Please choose an assignee.');

    setSaving(true);
    try {
      const payload = {
        title:       form.title.trim(),
        description: form.description.trim() || null,
        status:      form.status,
        due_date:    form.due_date || null,
      };
      if (form.assigned_to) payload.assigned_to = Number(form.assigned_to);
      await onSubmit(payload);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={onClose}
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 id="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} noValidate>
          <div className="modal-body">
            {error && (
              <div className="error-banner" role="alert">
                <span aria-hidden="true">⚠</span> {error}
              </div>
            )}

            <div className="field">
              <label htmlFor="task-title">Title <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span></label>
              <input
                id="task-title"
                ref={firstFieldRef}
                className="input"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Prepare Q3 sales deck"
                required
                aria-required="true"
              />
            </div>

            <div className="field">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                className="textarea"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Optional details…"
              />
            </div>

            <div className="field">
              <label htmlFor="task-assignee">
                Assigned to {!isEdit && <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>}
              </label>
              <select
                id="task-assignee"
                className="select"
                value={form.assigned_to}
                onChange={(e) => set('assigned_to', e.target.value)}
                aria-required={!isEdit}
              >
                <option value="">— Select employee —</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div className="row" style={{ gap: '1rem', alignItems: 'flex-start' }}>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="select"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="task-due">Due date</label>
                <input
                  id="task-due"
                  type="date"
                  className="input"
                  value={form.due_date}
                  onChange={(e) => set('due_date', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-foot">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</>
                : isEdit ? 'Save changes' : 'Create task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
