'use client';
import { PriorityLevel } from '@/lib/types';

interface Props {
  priority: PriorityLevel;
  size?: 'sm' | 'md' | 'lg';
}

const config: Record<PriorityLevel, { label: string; color: string; bg: string; dot: string }> = {
  Critical: { label: '🔴 Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', dot: '#ef4444' },
  High:     { label: '🟠 High',     color: '#f97316', bg: 'rgba(249,115,22,0.15)', dot: '#f97316' },
  Medium:   { label: '🟡 Medium',   color: '#eab308', bg: 'rgba(234,179,8,0.15)',  dot: '#eab308' },
  Low:      { label: '🟢 Low',      color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  dot: '#22c55e' },
};

export default function PriorityBadge({ priority, size = 'md' }: Props) {
  const c = config[priority];
  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 14px' : '3px 10px';
  const fontSize = size === 'sm' ? '11px' : size === 'lg' ? '14px' : '12px';
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.color}44`,
      padding,
      borderRadius: '9999px',
      fontSize,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {c.label}
    </span>
  );
}
