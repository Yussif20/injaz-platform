import { useState } from "react";

interface CountryCodePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const COUNTRY_CODES = [
  { value: "+966", label: "+966" },
  { value: "+20", label: "+20" },
];

export function CountryCodePicker({
  value,
  onChange,
  className = "",
}: CountryCodePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected =
    COUNTRY_CODES.find((code) => code.value === value) ?? COUNTRY_CODES[0];

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex items-center gap-1
          bg-white/90 text-text-dark text-xs sm:text-sm
          px-2.5 sm:px-3 py-1.5 sm:py-2
          rounded-full border border-grey-300 shadow-sm
          outline-none cursor-pointer
          focus:border-primary-500 focus:ring-2 focus:ring-primary-100
        "
      >
        <span className="font-medium">{selected.label}</span>
        <span
          className="inline-block w-3 h-3"
          style={{
            backgroundImage: "url('/icons/ui/arrow-down.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "14px 14px",
          }}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute z-20 right-0 mt-2 w-24
            bg-white border border-grey-200 rounded-xl shadow-lg
            py-1
          "
        >
          {COUNTRY_CODES.map((code) => (
            <button
              key={code.value}
              type="button"
              onClick={() => handleSelect(code.value)}
              className={`
                flex w-full items-center justify-between px-3 py-1.5 text-xs sm:text-sm
                text-text-dark hover:bg-primary-50
                ${code.value === selected.value ? "font-semibold" : "font-normal"}
              `}
            >
              <span>{code.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

