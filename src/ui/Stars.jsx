import React, { useMemo } from "react";

const Star = ({ fill = 0, className = "w-6 h-6" }) => {
  // fill: 0.0 → empty, 1.0 → full, anything in between = partial
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id={`grad-${fill}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fill * 100}%`} stopColor="#F97316" />
          <stop offset={`${fill * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={`url(#grad-${fill})`}
        stroke="#F97316"
        strokeWidth="1"
      />
    </svg>
  );
};

const Stars = ({ value, size = "w-6 h-6" }) => {
  const fills = useMemo(() => {
    const full = Math.floor(value);
    const decimal = value - full;
    return Array.from({ length: 5 }).map((_, i) => {
      if (i < full) return 1; // full
      if (i === full) return decimal; // partial
      return 0; // empty
    });
  }, [value]);

  return (
    <div className="flex gap-1">
      {fills.map((f, i) => (
        <Star key={i} fill={f} className={size} />
      ))}
    </div>
  );
};

export default Stars;
