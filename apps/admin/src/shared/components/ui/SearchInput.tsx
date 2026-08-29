"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "بحث...",
  debounceMs = 300,
}: SearchInputProps) {
  // What the user is typing, which runs ahead of the committed `value` by up to the
  // debounce interval. When `value` changes from outside — a cleared filter, a restored
  // query — the box adopts it. Doing that during render rather than from an effect means
  // the input never briefly shows the stale text after an external reset.
  const [localValue, setLocalValue] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  if (value !== lastValue) {
    setLastValue(value);
    setLocalValue(value);
  }

  // Debounced callback
  const debouncedOnChange = useCallback(
    (val: string) => {
      const timer = setTimeout(() => onChange(val), debounceMs);
      return () => clearTimeout(timer);
    },
    [onChange, debounceMs],
  );

  useEffect(() => {
    if (localValue === value) return;
    const cleanup = debouncedOnChange(localValue);
    return cleanup;
  }, [localValue, debouncedOnChange, value]);

  return (
    <div className="relative">
      <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-grey-200 py-2 pe-4 ps-10 text-sm text-grey-700 outline-none transition-colors placeholder:text-grey-400 focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
      />
    </div>
  );
}
