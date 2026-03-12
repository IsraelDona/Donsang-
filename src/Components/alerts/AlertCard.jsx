export default function AlertCard({
  bloodGroup,
  hospital,
  location,
  time,
  status,
  actionLabel,
  onAction,
}) {
  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
          {bloodGroup}
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{hospital}</p>
          <p className="text-xs text-gray-500">
            {location} • {time}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {status && <span className="text-xs font-semibold text-gray-500">{status}</span>}
        {actionLabel && (
          <button
            onClick={onAction}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </article>
  );
}
