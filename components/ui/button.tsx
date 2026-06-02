import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  href?: LinkProps["href"];
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[#1C1B1F] text-white shadow-[0_6px_18px_rgba(28,27,31,0.20)] hover:bg-[#29282c] active:scale-[0.978]",
  secondary:
    "border-[#DAD8D3] bg-transparent text-[#1C1B1F] hover:bg-white/50 active:scale-[0.978]",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  className,
  disabled = false,
  fullWidth = true,
  href,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-[54px] items-center justify-center rounded-2xl border px-5 text-base font-medium leading-none tracking-normal transition duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1C1B1F]",
    variantClasses[variant],
    fullWidth && "w-full",
    disabled && "pointer-events-none cursor-default opacity-35 shadow-none",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-disabled={disabled}
        className={classes}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={classes}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
