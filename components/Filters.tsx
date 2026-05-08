"use client";
import { SlidersHorizontal, X } from "lucide-react";

interface FiltersProps {
  filters: {
    city: string;
    roomType: string;
    maxPrice: number;
    amenities: string[];
    availability: string;
    distanceToSchool: string;
  };
  onChange: (filters: any) => void;
  onClose?: () => void;
}

const CITIES = ["all", "Enugu", "Nsukka", "Awka", "Owerri", "Asaba"];
const ROOM_TYPES = [
  { value: "all", label: "All Types" },
  { value: "single", label: "Single Room" },
  { value: "self-contain", label: "Self-Contain" },
  { value: "shared", label: "Shared Room" },
  { value: "flat", label: "Flat" },
];
const AMENITIES = [
  { value: "water", label: "💧 Water" },
  { value: "electricity", label: "⚡ Electricity" },
  { value: "security", label: "🔒 Security" },
  { value: "parking", label: "🚗 Parking" },
  { value: "wifi", label: "📶 WiFi" },
];
const DISTANCES = [
  { value: "any", label: "Any Distance" },
  { value: "5min", label: "≤ 5 min walk" },
  { value: "10min", label: "≤ 10 min walk" },
  { value: "20min", label: "≤ 20 min walk" },
];

export default function Filters({ filters, onChange, onClose }: FiltersProps) {
  const toggleAmenity = (val: string) => {
    const current = filters.amenities;
    onChange({
      amenities: current.includes(val)
        ? current.filter((a) => a !== val)
        : [...current, val],
    });
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-display font-semibold text-sm">
          <SlidersHorizontal size={15} className="text-lodge-500" />
          Filters
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {/* City */}
      <Section title="City">
        <div className="grid grid-cols-2 gap-1.5">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ city: c })}
              className={`text-xs py-1.5 px-2 rounded-lg border transition-colors capitalize ${
                filters.city === c
                  ? "bg-lodge-500/10 border-lodge-500/40 text-lodge-400"
                  : "bg-dark-700 border-dark-600 text-gray-500 hover:border-dark-500 hover:text-gray-400"
              }`}
            >
              {c === "all" ? "All Cities" : c}
            </button>
          ))}
        </div>
      </Section>

      {/* Room Type */}
      <Section title="Room Type">
        <div className="flex flex-col gap-1.5">
          {ROOM_TYPES.map((r) => (
            <button
              key={r.value}
              onClick={() => onChange({ roomType: r.value })}
              className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors ${
                filters.roomType === r.value
                  ? "bg-lodge-500/10 border-lodge-500/40 text-lodge-400"
                  : "bg-dark-700 border-dark-600 text-gray-500 hover:border-dark-500 hover:text-gray-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Max Price */}
      <Section title={`Max Price — ₦${filters.maxPrice.toLocaleString()}`}>
        <input
          type="range"
          min={80000}
          max={600000}
          step={10000}
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-lodge-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-600">
          <span>₦80k</span>
          <span>₦600k</span>
        </div>
      </Section>

      {/* Distance */}
      <Section title="Distance to School">
        <div className="flex flex-col gap-1.5">
          {DISTANCES.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ distanceToSchool: d.value })}
              className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors ${
                filters.distanceToSchool === d.value
                  ? "bg-lodge-500/10 border-lodge-500/40 text-lodge-400"
                  : "bg-dark-700 border-dark-600 text-gray-500 hover:border-dark-500 hover:text-gray-400"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Amenities */}
      <Section title="Amenities">
        <div className="flex flex-col gap-1.5">
          {AMENITIES.map((a) => (
            <label
              key={a.value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                onClick={() => toggleAmenity(a.value)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                  filters.amenities.includes(a.value)
                    ? "bg-lodge-500 border-lodge-500"
                    : "bg-dark-700 border-dark-500 group-hover:border-lodge-500/40"
                }`}
              >
                {filters.amenities.includes(a.value) && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleAmenity(a.value)}
                className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors"
              >
                {a.label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Availability */}
      <Section title="Availability">
        {[
          { value: "all", label: "Any" },
          { value: "immediate", label: "Available Now" },
          { value: "next-month", label: "Next Month" },
        ].map((av) => (
          <button
            key={av.value}
            onClick={() => onChange({ availability: av.value })}
            className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors ${
              filters.availability === av.value
                ? "bg-lodge-500/10 border-lodge-500/40 text-lodge-400"
                : "bg-dark-700 border-dark-600 text-gray-500 hover:border-dark-500 hover:text-gray-400"
            }`}
          >
            {av.label}
          </button>
        ))}
      </Section>

      {/* Reset */}
      <button
        onClick={() =>
          onChange({
            city: "all",
            roomType: "all",
            maxPrice: 600000,
            amenities: [],
            availability: "all",
            distanceToSchool: "any",
          })
        }
        className="text-xs text-gray-600 hover:text-lodge-400 transition-colors underline underline-offset-2"
      >
        Reset all filters
      </button>
    </div>
  );
}
