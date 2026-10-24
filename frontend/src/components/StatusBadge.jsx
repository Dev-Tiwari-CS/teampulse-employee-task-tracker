const LABELS = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${status}`} aria-label={`Status: ${LABELS[status] || status}`}>
      <span className="dot" aria-hidden="true" />
      {LABELS[status] || status}
    </span>
  );
}
