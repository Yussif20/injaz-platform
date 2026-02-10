"use client";

import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Quote,
  List,
  Link,
  ChevronDown,
} from "lucide-react";

export function EditorToolbar() {
  const [fontSize, setFontSize] = useState(14);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const toggleFormat = (format: string) => {
    setActiveFormats((prev) => {
      const next = new Set(prev);
      if (next.has(format)) {
        next.delete(format);
      } else {
        next.add(format);
      }
      return next;
    });
  };

  const formatButton = (format: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => toggleFormat(format)}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
        activeFormats.has(format)
          ? "bg-grey-200 text-text-dark"
          : "text-grey-500 hover:bg-grey-100"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-grey-200 bg-white px-3 py-2">
      {/* Font size selector */}
      <button
        type="button"
        className="flex items-center gap-1 rounded-lg border border-grey-200 px-3 py-1.5 text-sm text-text-dark"
      >
        {fontSize}
        <ChevronDown className="h-3.5 w-3.5 text-grey-400" />
      </button>

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {/* Text formatting */}
      {formatButton("bold", <Bold className="h-4 w-4" />)}
      {formatButton("italic", <Italic className="h-4 w-4" />)}
      {formatButton("underline", <Underline className="h-4 w-4" />)}

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {/* Alignment */}
      {formatButton("alignRight", <AlignRight className="h-4 w-4" />)}
      {formatButton("alignCenter", <AlignCenter className="h-4 w-4" />)}
      {formatButton("alignLeft", <AlignLeft className="h-4 w-4" />)}

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {/* Block formatting */}
      {formatButton("quote", <Quote className="h-4 w-4" />)}
      {formatButton("list", <List className="h-4 w-4" />)}

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {/* Link */}
      {formatButton("link", <Link className="h-4 w-4" />)}
    </div>
  );
}
