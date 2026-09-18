import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'danger' | 'indigo';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 select-none';

  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/20 active:scale-[0.98]',
    indigo: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/20 active:scale-[0.98]',
    outline: 'border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white',
    ghost: 'bg-transparent hover:bg-slate-800/80 text-slate-400 hover:text-slate-100',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/60',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-600/20',
  };

  const sizes = {
    sm: 'h-8 rounded-lg px-3 text-xs gap-1.5',
    md: 'h-9 rounded-xl px-4 text-xs gap-2',
    lg: 'h-10 rounded-xl px-5 text-sm gap-2',
    icon: 'h-9 w-9 rounded-xl p-0',
  };

  return (
    <button
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
}
