// Used when a request succeeded but returned nothing.

const EmptyState = ({ icon = "🎬", title, description, action }) => (
  <div className="card-surface mx-auto max-w-md p-8 text-center">
    <div className="text-4xl" aria-hidden="true">
      {icon}
    </div>
    <h3 className="mt-3 text-base font-semibold">{title}</h3>
    {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
