export function ChevronLeft({ size = 17 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 22 22"
      width={size}
    >
      <path
        d="M14 4L7 11L14 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export function ChevronRight() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 22 22" width="15">
      <path
        d="M8 4L15 11L8 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ChevronDown() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 22 22" width="15">
      <path
        d="M4 8L11 15L18 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export function Check({
  size = 22,
  width = 2.6,
}: {
  size?: number;
  width?: number;
}) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path
        d="M5 12.5L9.5 17L19 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={width}
      />
    </svg>
  );
}

export function People({ size = 13 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 16 16" width={size}>
      <circle cx="8" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3 13C3 10.5 5.2 9 8 9S13 10.5 13 13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
