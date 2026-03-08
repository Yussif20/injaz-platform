"use client";

import { useEffect, useState } from "react";
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

const FONT_SIZES = [10, 12, 14, 16, 18, 24, 36];
const FONT_SIZE_TO_EXEC: Record<number, string> = {
  10: "1", 12: "2", 14: "3", 16: "4", 18: "5", 24: "6", 36: "7",
};

interface EditorToolbarProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export function EditorToolbar({ editorRef }: EditorToolbarProps) {
  const [fontSize, setFontSize] = useState(14);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const execCmd = (command: string, value?: string) => {
    // Save the current selection before focusing — focus() can collapse it in some browsers
    const selection = window.getSelection();
    const range =
      selection && selection.rangeCount > 0
        ? selection.getRangeAt(0).cloneRange()
        : null;

    editorRef.current?.focus();

    // Restore selection if it was lost during focus()
    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    document.execCommand(command, false, value ?? "");
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("justifyRight")) formats.add("alignRight");
      if (document.queryCommandState("justifyCenter")) formats.add("alignCenter");
      if (document.queryCommandState("justifyLeft")) formats.add("alignLeft");
      if (document.queryCommandState("insertUnorderedList")) formats.add("list");
    } catch {
      // queryCommandState may throw in some environments
    }
    setActiveFormats(formats);
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () => document.removeEventListener("selectionchange", updateActiveFormats);
  }, []);

  // Use onMouseDown + preventDefault so the editor doesn't lose its selection
  const handleFormat = (e: React.MouseEvent, format: string) => {
    e.preventDefault();
    switch (format) {
      case "bold":        execCmd("bold"); break;
      case "italic":     execCmd("italic"); break;
      case "underline":  execCmd("underline"); break;
      case "alignRight":  execCmd("justifyRight"); break;
      case "alignCenter": execCmd("justifyCenter"); break;
      case "alignLeft":   execCmd("justifyLeft"); break;
      case "quote":      execCmd("formatBlock", "<blockquote>"); break;
      case "list":       execCmd("insertUnorderedList"); break;
      case "link": {
        const url = window.prompt("أدخل رابط URL:");
        if (url) execCmd("createLink", url);
        break;
      }
    }
  };

  const handleFontSize = (e: React.MouseEvent, size: number) => {
    e.preventDefault();
    setFontSize(size);
    setShowSizeMenu(false);
    execCmd("fontSize", FONT_SIZE_TO_EXEC[size] ?? "3");
  };

  const formatButton = (format: string, icon: React.ReactNode) => (
    <button
      key={format}
      type="button"
      onMouseDown={(e) => handleFormat(e, format)}
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
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setShowSizeMenu((v) => !v);
          }}
          className="flex items-center gap-1 rounded-lg border border-grey-200 px-3 py-1.5 text-sm text-text-dark"
        >
          {fontSize}
          <ChevronDown className="h-3.5 w-3.5 text-grey-400" />
        </button>
        {showSizeMenu && (
          <div className="absolute top-full z-10 mt-1 w-20 rounded-lg border border-grey-200 bg-white py-1 shadow-lg">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onMouseDown={(e) => handleFontSize(e, size)}
                className={`w-full px-3 py-1.5 text-center text-sm hover:bg-grey-50 ${
                  fontSize === size ? "font-medium text-primary-500" : "text-grey-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {formatButton("bold",      <Bold className="h-4 w-4" />)}
      {formatButton("italic",    <Italic className="h-4 w-4" />)}
      {formatButton("underline", <Underline className="h-4 w-4" />)}

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {formatButton("alignRight",  <AlignRight className="h-4 w-4" />)}
      {formatButton("alignCenter", <AlignCenter className="h-4 w-4" />)}
      {formatButton("alignLeft",   <AlignLeft className="h-4 w-4" />)}

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {formatButton("quote", <Quote className="h-4 w-4" />)}
      {formatButton("list",  <List className="h-4 w-4" />)}

      <div className="mx-2 h-6 w-px bg-grey-200" />

      {formatButton("link", <Link className="h-4 w-4" />)}
    </div>
  );
}
