"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { X, CheckCircle, AlertCircle, Trash2 } from "lucide-react";

type ToastType = "success" | "error" | "delete";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (opts: { type: ToastType; message: string }) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-success-500" />,
  error: <AlertCircle className="h-5 w-5 text-error-500" />,
  delete: <Trash2 className="h-5 w-5 text-error-500" />,
};

const BORDER_MAP: Record<ToastType, string> = {
  success: "border-s-4 border-success-500",
  error: "border-s-4 border-error-500",
  delete: "border-s-4 border-error-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const addToast = useCallback(
    ({ type, message }: { type: ToastType; message: string }) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, type, message }]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-6 start-6 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex min-w-[300px] items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-lg ${BORDER_MAP[toast.type]}`}
    >
      {ICON_MAP[toast.type]}
      <span className="flex-1 text-sm text-grey-700">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="cursor-pointer text-grey-400 hover:text-grey-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
