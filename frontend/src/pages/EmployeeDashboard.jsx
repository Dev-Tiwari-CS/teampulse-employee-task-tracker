import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/endpoints';

const PAGE_SIZE = 8;

const NEXT_STATUS = {
  pending:     'in_progress',
  in_progress: 'completed',
  completed:   null,
};
const NEXT_LABEL = {
  pending:     'Start task',
  in_progress: 'Mark complete',
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { push } = useToast();

  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await taskApi.list({
        status: statusFilter,
        sortBy: 'due_date',
        order: 'asc',
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
  }, [statusFilter, page]);

  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() =>
    tasks.reduce(
      (acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; },
      { pending: 0, in_progress: 0, completed: 0 }
    ), [tasks]
  );

  async function advance(task) {
    const next = NEXT_STATUS[task.status];
    if (!next) return;
    setUpdatingId(task.id);
    try {
      await taskApi.update(task.id, { status: next });
      push(`"${task.title}" moved to ${next.replace('_', ' ')}`);
      load();
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <>
      <Navbar />
      <div className="container page">
        <header className="page-head">
          <div>
            <h1>My Tasks</h1>
            <p className="lede">Hi {firstName} — here's everything on your plate.</p>
          </div>
        </header>

        {error && (
          <div className="error-banner" role="alert">
            <span aria-hidden="true">⚠</span> {error}
          </div>
        )}

        {/* Stat tiles */}
        <div className="stats" role="region" aria-label="Task summary">
          <div className="card stat">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Assigned to me</div>
            <div className="stat-bar"><span className="stat-bar-fill" style={{ width: '100%' }} /></div>
          </div>
          <div className="card stat">
            <div className="stat-value">{counts.pending}</div>
            <div className="stat-label">Pending <span className="muted">(this page)</span></div>
            <div className="stat-bar">
              <span className="stat-bar-fill" style={{ width: tasks.length ? `${Math.round((counts.pending/tasks.length)*100)}%` : '0%' }} />
            </div>
          </div>
          <div className="card stat">
            <div className="stat-value">{counts.in_progress}</div>
            <div className="stat-label">In progress <span className="muted">(this page)</span></div>
            <div className="stat-bar">
              <span className="stat-bar-fill" style={{ width: tasks.length ? `${Math.round((counts.in_progress/tasks.length)*100)}%` : '0%' }} />
            </div>
          </div>
          <div className="card stat">
            <div className="stat-value">{counts.completed}</div>
            <div className="stat-label">Completed <span className="muted">(this page)</span></div>
            <div className="stat-bar">
              <span className="stat-bar-fill" style={{ width: tasks.length ? `${Math.round((counts.completed/tasks.length)*100)}%` : '0%' }} />
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="card card-pad">
          <div className="section-label">Task list</div>

          <div className="filters">
            <div className="field">
              <label htmlFor="filter-status">Filter by status</label>
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
            {statusFilter && (
              <button
                className="btn btn-sm"
                onClick={() => setStatusFilter('')}
                aria-label="Clear status filter"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="table-wrap">
            <table className="tasks" aria-label="My tasks">
              <thead>
                <tr>
                  <th scope="col">Task</th>
                  <th scope="col">Status</th>
                  <th scope="col">Due date</th>
                  <th scope="col" className="right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="center-screen" style={{ height: 120 }}>
                        <span className="spinner" aria-hidden="true" />
                        <span>Loading tasks…</span>
                      </div>
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty">
                        <div className="empty-icon" aria-hidden="true">✅</div>
                        <div className="empty-title">Nothing here</div>
                        <div className="empty-sub">
                          {statusFilter ? 'No tasks match this filter.' : 'No tasks have been assigned to you yet.'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks.map((t) => {
                    const next = NEXT_STATUS[t.status];
                    return (
                      <tr key={t.id}>
                        <td>
                          <div className="task-title">{t.title}</div>
                          {t.description && (
                            <div className="task-desc">{t.description}</div>
                          )}
                        </td>
                        <td><StatusBadge status={t.status} /></td>
                        <td>{t.due_date || <span className="muted">—</span>}</td>
                        <td className="right">
                          {next ? (
                            <button
                              className="btn btn-sm btn-primary"
                              disabled={updatingId === t.id}
                              onClick={() => advance(t)}
                              aria-label={`${NEXT_LABEL[t.status]}: ${t.title}`}
                            >
                              {updatingId === t.id
                                ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Updating…</>
                                : NEXT_LABEL[t.status]
                              }
                            </button>
                          ) : (
                            <span className="muted" aria-label="Task complete">Done ✓</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={page} limit={PAGE_SIZE} total={total} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
