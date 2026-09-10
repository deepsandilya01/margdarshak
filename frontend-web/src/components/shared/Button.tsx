import React from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'technical' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-primary text-white border border-primary',
    'hover:bg-primary-container',
    'focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  secondary: [
    'bg-surface text-primary border border-outline-variant',
    'hover:bg-surface-container-low hover:border-[#74777e]',
    'focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-primary border border-transparent',
    'hover:bg-surface-container',
    'focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  technical: [
    'bg-background text-on-surface-variant border border-dashed border-outline-variant',
    'font-mono text-[12px]',
    'hover:bg-surface-container-low hover:border-[#74777e]',
    'focus-visible:ring-2 focus-visible:ring-[#1d4ed8] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  destructive: [
    'bg-surface text-[var(--status-verify-text)] border border-[var(--status-verify-border)]',
    'hover:bg-[var(--status-verify-bg)]',
    'focus-visible:ring-2 focus-visible:ring-[#be123c] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[13px] leading-[18px] rounded',
  md: 'px-4 py-2 text-[14px] leading-[22px] rounded',
  lg: 'px-6 py-3 text-[16px] leading-[24px] font-semibold rounded',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  children,
  className,
  disabled,
  as: Tag = 'button',
  href,
  ...props
}: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 outline-none select-none',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (Tag === 'a' && href) {
    return (
      <a href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
