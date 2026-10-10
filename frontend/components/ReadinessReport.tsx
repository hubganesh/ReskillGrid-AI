'use client';
import { GapAnalysisResult } from '@/lib/types';
import ReadinessGauge from './ReadinessGauge';
import PriorityBadge from './PriorityBadge';

interface Props {
  result: GapAnalysisResult;
  onBack: () => void;
  onRestart: () => void;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8b9dc3', marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 7, background: '#1e2d4d', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function ReadinessReport({ result, onBack, onRestart }: Props) {
  const { studentProfile, readinessScore, projectedScore, readinessBreakdown, strongAreas, criticalGaps, recommendations, targetRole, evidencePlan } = result;
  const completedProjects = evidencePlan.filter(t => t.status === 'completed').length;

  const getReadinessLabel = (score: number) => {
    if (score >= 85) return { text: 'Ready to Apply', color: '#22c55e' };
    if (score >= 70) return { text: 'Almost Ready', color: '#4f8ef7' };
    if (score >= 50) return { text: 'Good Progress', color: '#eab308' };
    return { text: 'Needs Focus', color: '#f97316' };
  };

  const label = getReadinessLabel(readinessScore);

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
            <p style={{ margin: 0, color: '#8b9dc3', fontSize: 13 }}>Readiness Report · {studentProfile.name}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onBack} style={{ padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid #1e2d4d', color: '#8b9dc3', fontSize: 13, cursor: 'pointer' }}>← Back</button>
            <button onClick={onRestart} style={{ padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(79,142,247,0.4)', color: '#4f8ef7', fontSize: 13, cursor: 'pointer' }}>🔄 New Analysis</button>
          </div>
        </div>

        {/* Agent badge */}
        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>Readiness Auditor Agent</div>
            <div style={{ fontSize: 12, color: '#8b9dc3' }}>Final evaluation: skills + evidence + projects + resume alignment</div>
          </div>
        </div>

        {/* Main report card */}
        <div style={{ background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
          {/* Report title bar */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(124,92,216,0.1))',
            borderBottom: '1px solid #1e2d4d',
            padding: '20px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
          }}>
            <div>
              <div style={{ fontSize: 13, color: '#8b9dc3', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                ReskillGrid Readiness Report
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#e8edf7' }}>
                {studentProfile.name}
              </div>
              <div style={{ fontSize: 14, color: '#4f8ef7', marginTop: 2 }}>
                Target Role: {targetRole} · {studentProfile.degree}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ReadinessGauge value={readinessScore} size="lg" />
              <div style={{ fontSize: 13, fontWeight: 700, color: label.color, marginTop: 4 }}>{label.text}</div>
            </div>
          </div>

          <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            {/* Score breakdown */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e8edf7', marginTop: 0, marginBottom: 16 }}>Score Breakdown</h3>
              <ScoreBar label="Skills Coverage" value={readinessBreakdown.skillsScore} color="#4f8ef7" />
              <ScoreBar label="Evidence & Projects" value={readinessBreakdown.evidenceScore} color="#7c5cd8" />
              <ScoreBar label="Portfolio Strength" value={readinessBreakdown.projectsScore} color="#22c55e" />
              <ScoreBar label="Resume Alignment" value={readinessBreakdown.resumeScore} color="#f59e0b" />
            </div>

            {/* Profile summary */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e8edf7', marginTop: 0, marginBottom: 16 }}>Profile Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Degree', value: studentProfile.degree },
                  { label: 'College', value: studentProfile.college },
                  { label: 'Projects', value: `${studentProfile.projects.length} documented` },
                  { label: 'Certifications', value: `${studentProfile.certifications.length} completed` },
                  { label: 'Evidence Tasks Done', value: `${completedProjects}/${evidencePlan.length}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e2d4d', paddingBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#8b9dc3' }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e8edf7' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strong areas + Critical gaps + Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#0f1629', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', marginTop: 0, marginBottom: 14 }}>✅ Strong Areas</h3>
            {strongAreas.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8b9dc3', margin: 0 }}>Complete more projects to build strengths.</p>
            ) : strongAreas.slice(0, 5).map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 13, color: '#e8edf7' }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#0f1629', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ef4444', marginTop: 0, marginBottom: 14 }}>🔴 Critical Gaps</h3>
            {criticalGaps.length === 0 ? (
              <p style={{ fontSize: 13, color: '#22c55e', margin: 0 }}>No critical gaps! Excellent work.</p>
            ) : criticalGaps.slice(0, 5).map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ fontSize: 13, color: '#e8edf7' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ background: '#0f1629', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#4f8ef7', marginTop: 0, marginBottom: 16 }}>💡 Recommended Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recommendations.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'rgba(79,142,247,0.15)',
                  border: '1px solid rgba(79,142,247,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#4f8ef7', flexShrink: 0, marginTop: 1,
                }}>{i + 1}</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: '#8b9dc3', lineHeight: 1.6 }}>{r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before/After projection */}
        <div style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.06), rgba(124,92,216,0.06))', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e8edf7', marginTop: 0, marginBottom: 20 }}>📈 Readiness Journey</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <ReadinessGauge value={readinessScore} size="md" showLabel={false} />
              <div style={{ fontSize: 12, color: '#8b9dc3', marginTop: 4 }}>Current</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#8b9dc3', minWidth: 200 }}>
              <div>Complete all evidence projects to reach <strong style={{ color: '#22c55e' }}>{projectedScore}%</strong></div>
              <div style={{ height: 7, background: '#1e2d4d', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${readinessScore}%`, background: '#4f8ef7', borderRadius: 4 }} />
              </div>
              <div style={{ height: 7, background: '#1e2d4d', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${projectedScore}%`, background: '#22c55e', borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11 }}>
                <span style={{ color: '#4f8ef7' }}>■</span> Current &nbsp;
                <span style={{ color: '#22c55e' }}>■</span> After completing projects
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ReadinessGauge value={projectedScore} size="md" showLabel={false} color="#22c55e" />
              <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>Projected</div>
            </div>
          </div>
        </div>

        {/* Cycle footer */}
        <div style={{ marginTop: 28, padding: 20, background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8b9dc3', marginBottom: 10 }}>ReskillGrid Continuous Cycle</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap', fontSize: 12 }}>
            {['Assess', 'Gap', 'Prioritize', 'Reskill', 'Build', 'Prove', 'Reassess'].map((step, i, arr) => (
              <span key={step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#4f8ef7', fontWeight: 700 }}>{step}</span>
                {i < arr.length - 1 && <span style={{ color: '#1e2d4d' }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
