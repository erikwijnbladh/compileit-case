import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
};

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  href: LinkProps["href"];
  variant?: ButtonVariant;
};

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-foreground text-white shadow-lg shadow-foreground/20 hover:brightness-150 active:scale-95",
  secondary:
    "border-line bg-transparent text-foreground hover:bg-white/50 active:scale-95",
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonClasses({
  className,
  fullWidth = true,
  variant = "primary",
}: {
  className?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
} = {}) {
  return cn(
    "inline-flex h-14 items-center justify-center rounded-2xl border px-5 text-base font-medium leading-none tracking-normal transition duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground",
    buttonVariants[variant],
    fullWidth && "w-full",
    className,
  );
}

export function Button({
  children,
  className,
  disabled = false,
  fullWidth = true,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = cn(
    buttonClasses({ className, fullWidth, variant }),
    disabled && "pointer-events-none cursor-default opacity-35 shadow-none",
  );

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

export function ButtonLink({
  children,
  className,
  fullWidth = true,
  href,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonClasses({ className, fullWidth, variant })}
    >
      {children}
    </Link>
  );
}
