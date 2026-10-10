'use client';

interface Props {
  value: number; // 0–100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

function getColor(value: number, custom?: string) {
  if (custom) return custom;
  if (value >= 80) return '#22c55e';
  if (value >= 60) return '#eab308';
  if (value >= 40) return '#f97316';
  return '#ef4444';
}

export default function ReadinessGauge({ value, size = 'md', showLabel = true, color }: Props) {
  const radius = size === 'lg' ? 70 : size === 'sm' ? 40 : 55;
  const stroke = size === 'lg' ? 10 : size === 'sm' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (value / 100) * circumference;
  const dim = (radius + stroke) * 2 + 4;
  const c = getColor(value, color);
  const fontSize = size === 'lg' ? 28 : size === 'sm' ? 16 : 22;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={dim / 2} cy={dim / 2} r={radius}
          fill="none" stroke="#1e2d4d" strokeWidth={stroke}
        />
        <circle
          cx={dim / 2} cy={dim / 2} r={radius}
          fill="none" stroke={c} strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text
          x="50%" y="50%"
          textAnchor="middle" dominantBaseline="central"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize, fontWeight: 700, fill: c }}
        >
          {value}%
        </text>
      </svg>
      {showLabel && (
        <span style={{ fontSize: 12, color: '#8b9dc3', fontWeight: 600 }}>
          {value >= 80 ? 'Job Ready' : value >= 60 ? 'Good Progress' : value >= 40 ? 'Needs Work' : 'Getting Started'}
        </span>
      )}
    </div>
  );
}
