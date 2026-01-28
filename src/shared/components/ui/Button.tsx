import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
}

const variantClasses = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-800 active:bg-primary-700",
  secondary:
    "bg-secondary-700 text-white hover:bg-secondary-800 active:bg-secondary-900",
  success:
    "bg-success-500 text-white hover:bg-success-600 active:bg-success-700",
  warning:
    "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700",
  outline:
    "border-2 bg-white border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100",
};

const sizeClasses = {
  lg: "w-[200px] h-[54px] px-2 py-2 text-lg",
  md: "w-[200px] h-[48px] px-2 py-2 text-base",
  sm: "w-[200px] h-[32px] px-2 py-3 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      isLoading = false,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          flex justify-center items-center gap-2
          font-normal rounded-4xl transition-colors duration-200
          disabled:bg-[#EBEBEB] disabled:text-[#666666] disabled:cursor-not-allowed disabled:border-transparent
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className || ""}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
