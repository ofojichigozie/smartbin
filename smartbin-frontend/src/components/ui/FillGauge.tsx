interface FillGaugeProps {
  percentage: number;
  size?: number;
}

const getColor = (pct: number) => {
  if (pct >= 95) return '#ef4444'; // red-500
  if (pct >= 80) return '#f59e0b'; // amber-500
  return '#10b981'; // emerald-500
};

const getLabel = (pct: number) => {
  if (pct >= 95) return 'Full';
  if (pct >= 80) return 'Almost Full';
  if (pct >= 50) return 'Half Full';
  return 'Good';
};

const FillGauge = ({ percentage, size = 140 }: FillGaugeProps) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;
  const color = getColor(percentage);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 120 120">
        {/* Background track */}
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        {/* Progress arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="60" y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
          {percentage}%
        </text>
        <text x="60" y="72" textAnchor="middle" fontSize="10" fill="#6b7280">
          {getLabel(percentage)}
        </text>
      </svg>
    </div>
  );
};

export default FillGauge;
