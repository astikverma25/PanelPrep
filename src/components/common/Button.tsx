import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5 font-bold",
  }[size];

  const variantStyles = {
    primary:
      "bg-slate-950 hover:bg-slate-800 text-white shadow-md hover:shadow-lg focus:ring-slate-900 border border-slate-900",
    secondary:
      "bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm focus:ring-slate-400",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500 border border-red-700",
    outline:
      "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-300 focus:ring-slate-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-950",
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
