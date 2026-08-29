/**
 * OTP Input Component - 6 digit code input with auto-focus
 */

"use client";

import { useRef, useMemo, type KeyboardEvent, type ClipboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // The component is fully controlled: `value` is the single source of truth and every
  // edit is reported through `onChange`. Deriving the per-box digits during render keeps
  // it that way. Mirroring `value` into state and re-syncing it from an effect would
  // render twice for every keystroke, and leaves a window where the boxes disagree with
  // the value the parent holds.
  const otp = useMemo<string[]>(() => {
    const digits = value.split("").slice(0, length);
    return Array.from({ length }, (_, i) => digits[i] ?? "");
  }, [value, length]);

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digit = inputValue.replace(/[^0-9]/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    onChange(newOtp.join(""));

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);

    if (pastedData) {
      const newOtp = pastedData.split("");
      const padded = [...newOtp, ...Array(length - newOtp.length).fill("")];
      onChange(padded.join(""));

      // Focus last filled input or last input
      const lastIndex = Math.min(pastedData.length, length) - 1;
      focusInput(lastIndex);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 sm:gap-3 justify-center" dir="ltr">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            className={`
              w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-medium
              bg-[#EBEBEB] text-text-dark rounded-xl sm:rounded-2xl outline-none
              border-2 transition-colors duration-200
              ${error ? "border-warning-500" : "border-transparent focus:border-primary-500"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          />
        ))}
      </div>
      {error && (
        <p className="text-warning-500 text-xs sm:text-sm text-center">{error}</p>
      )}
    </div>
  );
}
