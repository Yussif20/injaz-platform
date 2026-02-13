"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmLabel = "حذف",
  cancelLabel = "إلغاء",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="mb-6 text-sm text-grey-600">{message}</p>
      <div className="flex gap-3">
        <Button
          variant="danger"
          onClick={onConfirm}
          loading={isLoading}
          className="flex-1"
        >
          {confirmLabel}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}
