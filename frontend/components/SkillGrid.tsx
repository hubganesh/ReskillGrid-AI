'use client';
import { Skill, PriorityLevel } from '@/lib/types';
import PriorityBadge from './PriorityBadge';
import ReadinessGauge from './ReadinessGauge';

interface Props {
  skills: Skill[];
  readinessScore: number;
  studentName: string;
  targetRole: string;
  onNext: () => void;
}

function LevelBar({ current, required }: { current: number; required: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: 16, height: 8, borderRadius: 3,
          background: i <= current ? '#4f8ef7'
            : i <= required ? 'rgba(79,142,247,0.2)'
            : '#1e2d4d',
          border: i <= required && i > current ? '1px dashed rgba(79,142,247,0.4)' : 'none',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

function StatusIcon({ gap }: { gap: number }) {
  if (gap === 0) return <span title="Met" style={{ fontSize: 15 }}>✅</span>;
  if (gap === 1) return <span title="Almost there — small gap" style={{ fontSize: 15 }}>⚠️</span>;
  return <span title="Significant gap" style={{ fontSize: 15 }}>🔴</span>;
}

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    Technical: '#4f8ef7',
    Tools: '#7c5cd8',
    Domain: '#22c55e',
    'Soft Skills': '#f59e0b',
  };
  return map[cat] || '#8b9dc3';
}

export default function SkillGrid({ skills, readinessScore, studentName, targetRole, onNext }: Props) {
  const metCount = skills.filter(s => s.gap === 0).length;
  const gapCount = skills.filter(s => s.gap > 0).length;
  const criticalCount = skills.filter(s => s.priority === 'Critical').length;

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '24px 16px' }}>
      {/* Top bar */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#e8edf7' }}>ReskillGrid AI</span>
            </div>
            <p style={{ margin: 0, color: '#8b9dc3', fontSize: 13 }}>
              {studentName} · <span style={{ color: '#4f8ef7' }}>{targetRole}</span>
            </p>
          </div>
          <button onClick={onNext} style={{
            padding: '10px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)',
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>View AI Analysis →</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20, alignItems: 'start' }}>
        {/* Main grid */}
        <div>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Skills Met', value: metCount, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
              { label: 'Skill Gaps', value: gapCount, color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
              { label: 'Critical', value: criticalCount, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}33`, borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: 12, color: '#8b9dc3', marginTop: 2 }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Category legend */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            {categories.map(cat => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8b9dc3' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: categoryColor(cat) }} />
                {cat}
              </div>
            ))}
          </div>

          {/* The Grid Table */}
          <div style={{ background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 14, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '180px 130px 130px 70px 130px 1fr',
              gap: 0,
              background: '#0a1322',
              borderBottom: '1px solid #1e2d4d',
              padding: '12px 20px',
            }}>
              {['Skill', 'Current Level', 'Required', 'Gap', 'Priority', 'Evidence'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: '#8b9dc3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {skills.map((skill, idx) => (
              <div
                key={skill.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 130px 130px 70px 130px 1fr',
                  gap: 0,
                  padding: '14px 20px',
                  borderBottom: idx < skills.length - 1 ? '1px solid #1e2d4d' : 'none',
                  background: skill.priority === 'Critical' ? 'rgba(239,68,68,0.03)' : 'transparent',
                  alignItems: 'center',
                  transition: 'background 0.2s',
                }}
              >
                {/* Skill name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 32, borderRadius: 3, background: categoryColor(skill.category), flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e8edf7' }}>{skill.name}</div>
                    <div style={{ fontSize: 11, color: categoryColor(skill.category) }}>{skill.category}</div>
                  </div>
                </div>
                {/* Current */}
                <div>
                  <div style={{ fontSize: 13, color: '#e8edf7', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{skill.currentLevel}</span><span style={{ color: '#8b9dc3' }}>/5</span>
                  </div>
                  <LevelBar current={skill.currentLevel} required={skill.requiredLevel} />
                </div>
                {/* Required */}
                <div style={{ fontSize: 13, color: '#8b9dc3' }}>
                  <span style={{ fontWeight: 600, color: '#e8edf7' }}>{skill.requiredLevel}</span>/5
                </div>
                {/* Gap */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StatusIcon gap={skill.gap} />
                  {skill.gap > 0 && <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>−{skill.gap}</span>}
                </div>
                {/* Priority */}
                <div><PriorityBadge priority={skill.priority} size="sm" /></div>
                {/* Evidence */}
                <div style={{ fontSize: 12, color: '#8b9dc3' }}>{skill.evidence}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8b9dc3' }}>
              <div style={{ width: 14, height: 8, borderRadius: 2, background: '#4f8ef7' }} /> Met
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8b9dc3' }}>
              <div style={{ width: 14, height: 8, borderRadius: 2, border: '1px dashed rgba(79,142,247,0.4)', background: 'rgba(79,142,247,0.2)' }} /> Gap to fill
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8b9dc3' }}>
              <div style={{ width: 14, height: 8, borderRadius: 2, background: '#1e2d4d' }} /> Not required
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 14, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8b9dc3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Overall Readiness</div>
            <ReadinessGauge value={readinessScore} size="lg" />
          </div>

          <div style={{ background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8b9dc3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Skills by Priority</div>
            {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map(p => {
              const count = skills.filter(s => s.priority === p && s.gap > 0).length;
              if (count === 0) return null;
              return (
                <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <PriorityBadge priority={p} size="sm" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#e8edf7' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
