import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import TaskModal from '../components/TaskModal';
import { useToast } from '../components/Toast';
import { taskApi, userApi } from '../api/endpoints';

const PAGE_SIZE = 8;

export default function AdminDashboard() {
  const { push } = useToast();

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [dueBefore, setDueBefore] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await taskApi.list({
        status: statusFilter,
        dueBefore,
        sortBy,
        order: sortBy === 'due_date' ? 'asc' : 'desc',
        page,
        limit: PAGE_SIZE,
      });
      setTasks(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dueBefore, sortBy, page]);

  useEffect(() => {
    userApi
      .list('employee')
      .then(setEmployees)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => { setPage(1); }, [statusFilter, dueBefore, sortBy]);
  useEffect(() => { loadTasks(); }, [loadTasks]);

  const stats = useMemo(() => {
    const byStatus = tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});
    return { byStatus };
  }, [tasks]);

  function openCreate() { setEditing(null); setModalOpen(true); }
  function openEdit(task) { setEditing(task); setModalOpen(true); }

  async function handleSubmit(payload) {
    try {
      if (editing) {
        await taskApi.update(editing.id, payload);
        push('Task updated successfully');
      } else {
        await taskApi.create(payload);
        push('Task created successfully');
      }
      setModalOpen(false);
      setEditing(null);
      loadTasks();
    } catch (err) {
      throw err; // let the modal display the error
    }
  }

  const hasFilters = statusFilter || dueBefore;

  return (
    <>
      <Navbar />
      <div className="container page">
        <header className="page-head">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="lede">Manage your team, assign tasks, and track progress.</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} aria-label="Create new task">
            + New Task
          </button>
        </header>

        {error && (
          <div className="error-banner" role="alert">
            <span aria-hidden="true">⚠</span> {error}
          </div>
        )}

        {/* Stat tiles */}
        <div className="stats" role="region" aria-label="Summary statistics">
          <div className="card stat">
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Team members</div>
            <div className="stat-bar"><span className="stat-bar-fill" style={{ width: '100%' }} /></div>
          </div>
          <div className="card stat">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total tasks</div>
            <div className="stat-bar"><span className="stat-bar-fill" style={{ width: '100%' }} /></div>
          </div>
          <div className="card stat">
            <div className="stat-value">{stats.byStatus.in_progress || 0}</div>
            <div className="stat-label">In progress <span className="muted">(this page)</span></div>
            <div className="stat-bar">
              <span className="stat-bar-fill" style={{ width: total ? `${Math.round(((stats.byStatus.in_progress||0)/tasks.length)*100)||0}%` : '0%' }} />
            </div>
          </div>
          <div className="card stat">
            <div className="stat-value">{stats.byStatus.completed || 0}</div>
            <div className="stat-label">Completed <span className="muted">(this page)</span></div>
            <div className="stat-bar">
              <span className="stat-bar-fill" style={{ width: tasks.length ? `${Math.round(((stats.byStatus.completed||0)/tasks.length)*100)||0}%` : '0%' }} />
            </div>
          </div>
        </div>

        {/* Tasks panel */}
        <div className="card card-pad">
          <div className="section-label">All Tasks</div>

          {/* Filters */}
          <div className="filters" role="search" aria-label="Filter tasks">
            <div className="field">
              <label htmlFor="filter-status">Status</label>
              <select
                id="filter-status"
                className="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="filter-due">Due before</label>
              <input
                id="filter-due"
                type="date"
                className="input"
                value={dueBefore}
                onChange={(e) => setDueBefore(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="filter-sort">Sort by</label>
              <select
                id="filter-sort"
                className="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created_at">Newest first</option>
                <option value="due_date">Due date</option>
                <option value="status">Status</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
            {hasFilters && (
              <button
                className="btn btn-sm"
                onClick={() => { setStatusFilter(''); setDueBefore(''); }}
                aria-label="Clear all filters"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="table-wrap">
            <table className="tasks" aria-label="Tasks table">
              <thead>
                <tr>
                  <th scope="col">Task</th>
                  <th scope="col">Assigned to</th>
                  <th scope="col">Status</th>
                  <th scope="col">Due date</th>
                  <th scope="col" className="right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="center-screen" style={{ height: 120 }}>
                        <span className="spinner" aria-hidden="true" />
                        <span>Loading tasks…</span>
                      </div>
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty">
                        <div className="empty-icon" aria-hidden="true">📋</div>
                        <div className="empty-title">No tasks found</div>
                        <div className="empty-sub">
                          {hasFilters ? 'Try adjusting your filters.' : 'Create a new task to get started.'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="task-title">{t.title}</div>
                        {t.description && (
                          <div className="task-desc">{t.description}</div>
                        )}
                      </td>
                      <td>
                        {t.assignee_name || <span className="muted">Unassigned</span>}
                      </td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>{t.due_date || <span className="muted">—</span>}</td>
                      <td className="right">
                        <button
                          className="btn btn-sm"
                          onClick={() => openEdit(t)}
                          aria-label={`Edit task: ${t.title}`}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={page} limit={PAGE_SIZE} total={total} onChange={setPage} />
        </div>
      </div>

      {modalOpen && (
        <TaskModal
          task={editing}
          employees={employees}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
