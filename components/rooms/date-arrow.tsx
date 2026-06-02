export function DateArrow({
  children,
  disabled = false,
  label,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-line bg-card transition enabled:hover:bg-surface-muted enabled:active:scale-90 disabled:cursor-default disabled:text-faint disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
