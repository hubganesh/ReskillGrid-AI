'use client';
import { Skill, PriorityLevel } from '@/lib/types';
import PriorityBadge from './PriorityBadge';

interface Props {
  topGaps: Skill[];
  strongAreas: string[];
  recommendations: string[];
  targetRole: string;
  studentName: string;
  onNext: () => void;
  onBack: () => void;
}

const priorityConfig: Record<PriorityLevel, { bg: string; border: string; icon: string; barColor: string }> = {
  Critical: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.25)', icon: '🔴', barColor: '#ef4444' },
  High:     { bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.25)', icon: '🟠', barColor: '#f97316' },
  Medium:   { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.25)',  icon: '🟡', barColor: '#eab308' },
  Low:      { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.25)', icon: '🟢', barColor: '#22c55e' },
};

function ImpactBar({ gap, required }: { gap: number; required: number }) {
  const pct = Math.round((gap * required / 20) * 100);
  const color = gap * required >= 12 ? '#ef4444' : gap * required >= 8 ? '#f97316' : '#eab308';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8b9dc3', marginBottom: 4 }}>
        <span>Impact Score</span>
        <span style={{ color, fontWeight: 700 }}>{gap * required}/20</span>
      </div>
      <div style={{ height: 5, background: '#1e2d4d', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function PriorityAnalysis({ topGaps, strongAreas, recommendations, targetRole, studentName, onNext, onBack }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', padding: '24px 16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#e8edf7' }}>ReskillGrid AI</span>
            </div>
            <p style={{ margin: 0, color: '#8b9dc3', fontSize: 13 }}>
              {studentName} · Priority Analysis for <span style={{ color: '#4f8ef7' }}>{targetRole}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onBack} style={{
              padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid #1e2d4d', color: '#8b9dc3', fontSize: 13, cursor: 'pointer',
            }}>← Back</button>
            <button onClick={onNext} style={{
              padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Evidence Plan →</button>
          </div>
        </div>

        {/* Agent badge */}
        <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4f8ef7' }}>Priority Agent</div>
            <div style={{ fontSize: 12, color: '#8b9dc3' }}>Ranked by: Industry Demand × Skill Gap × Role Importance</div>
          </div>
        </div>

        {/* Top priority gaps */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e8edf7', marginBottom: 16 }}>
            Top Priority Gaps
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topGaps.filter(s => s.gap > 0).slice(0, 6).map((skill, idx) => {
              const cfg = priorityConfig[skill.priority];
              return (
                <div key={skill.name} style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: 14,
                  padding: '18px 22px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: '#0a0f1e',
                        border: `1px solid ${cfg.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 800, color: '#8b9dc3',
                      }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#e8edf7' }}>{skill.name}</span>
                          <PriorityBadge priority={skill.priority} size="sm" />
                        </div>
                        <div style={{ fontSize: 12, color: '#8b9dc3' }}>
                          Current: <strong style={{ color: '#e8edf7' }}>{skill.currentLevel}/5</strong>
                          &nbsp;→&nbsp;
                          Required: <strong style={{ color: '#4f8ef7' }}>{skill.requiredLevel}/5</strong>
                          &nbsp;·&nbsp;Gap: <strong style={{ color: '#ef4444' }}>{skill.gap}</strong>
                        </div>
                      </div>
                    </div>
                    <div style={{ minWidth: 180 }}>
                      <ImpactBar gap={skill.gap} required={skill.requiredLevel} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two columns: Strong areas + Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', marginTop: 0, marginBottom: 14 }}>✅ Strong Areas</h3>
            {strongAreas.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8b9dc3', margin: 0 }}>Build more skills to identify strengths.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {strongAreas.slice(0, 5).map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#e8edf7' }}>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4f8ef7', marginTop: 0, marginBottom: 14 }}>💡 Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: '#4f8ef7', flexShrink: 0, marginTop: 2,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: '#8b9dc3', lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
