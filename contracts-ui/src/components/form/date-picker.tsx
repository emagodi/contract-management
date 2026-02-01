import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';

// Inline Icon since external import was missing
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

type PropsType = {
  name?: string;
  id?: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: flatpickr.Options.Hook | flatpickr.Options.Hook[];
  defaultDate?: flatpickr.Options.DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function DatePicker({
  name,
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
  className = "",
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const flatPickr = flatpickr(inputRef.current, {
      mode: mode,
      dateFormat: "Y-m-d",     // Format for the hidden value (backend friendly)
      altInput: true,          // Create a separate input for display
      altFormat: "j F Y",      // Display format: 1 February 2026
      defaultDate: defaultDate,
      onChange: onChange,
      allowInput: true,        // Allow manual typing if needed
      disableMobile: "true",   // Force flatpickr on mobile for consistent UI
    });

    return () => {
      flatPickr.destroy();
    };
  }, [mode, onChange, defaultDate]);

  return (
    <div className="w-full">
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative w-full group">
        <input
          ref={inputRef}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultDate as string}
          style={{ display: 'none' }}
          className={`px-3 py-2 rounded-md outline-none border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white w-full cursor-pointer ${className}`}
        />
        
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 group-hover:text-blue-600 transition-colors">
          <CalendarIcon className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
}
