export function ComingSoon({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="mb-stack-md flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <span className="material-symbols-outlined text-[36px] text-secondary-container">
          {icon}
        </span>
      </div>
      <h2 className="mb-2 text-headline-md text-text-primary">{title}</h2>
      <p className="max-w-md text-body-md text-text-secondary">{description}</p>
      <span className="mt-stack-md rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-sm font-semibold text-text-secondary">
        Coming soon
      </span>
    </div>
  );
}
