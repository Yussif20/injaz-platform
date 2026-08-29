type Variant = "success" | "warning" | "error" | "neutral" | "info";

interface StatusBadgeProps {
  label: string;
  variant: Variant;
}

const variantStyles: Record<Variant, string> = {
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  error: "bg-error-50 text-error-700",
  neutral: "bg-grey-100 text-grey-600",
  info: "bg-primary-50 text-primary-500",
};

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
