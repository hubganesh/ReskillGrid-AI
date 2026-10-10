'use client';
import { useState } from 'react';
import { EvidenceTask, PriorityLevel } from '@/lib/types';
import PriorityBadge from './PriorityBadge';

interface Props {
  evidencePlan: EvidenceTask[];
  studentName: string;
  targetRole: string;
  onNext: () => void;
  onBack: () => void;
  onUpdateTask: (skill: string, status: EvidenceTask['status']) => void;
}

const priorityColors: Record<PriorityLevel, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

export default function EvidencePlan({ evidencePlan, studentName, targetRole, onNext, onBack, onUpdateTask }: Props) {
  const completed = evidencePlan.filter(t => t.status === 'completed').length;
  const inProgress = evidencePlan.filter(t => t.status === 'in-progress').length;
  const totalDays = evidencePlan.reduce((sum, t) => sum + t.estimatedDays, 0);

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
              {studentName} · Evidence Plan for <span style={{ color: '#4f8ef7' }}>{targetRole}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onBack} style={{ padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid #1e2d4d', color: '#8b9dc3', fontSize: 13, cursor: 'pointer' }}>← Back</button>
            <button onClick={onNext} style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Readiness Report →</button>
          </div>
        </div>

        {/* Agent badge */}
        <div style={{ background: 'rgba(124,92,216,0.08)', border: '1px solid rgba(124,92,216,0.2)', borderRadius: 10, padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🛠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#7c5cd8' }}>Evidence Builder Agent</div>
            <div style={{ fontSize: 12, color: '#8b9dc3' }}>Don't just learn it. Build it. Prove it.</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Projects', value: evidencePlan.length, color: '#4f8ef7' },
            { label: 'Completed', value: completed, color: '#22c55e' },
            { label: 'In Progress', value: inProgress, color: '#f59e0b' },
            { label: 'Est. Days', value: totalDays, color: '#7c5cd8' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0f1629', border: '1px solid #1e2d4d', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#8b9dc3', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Evidence Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {evidencePlan.map((task, idx) => {
            const color = priorityColors[task.priority];
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in-progress';

            return (
              <div key={task.skill} style={{
                background: '#0f1629',
                border: `1px solid ${isCompleted ? '#22c55e44' : isInProgress ? '#4f8ef744' : '#1e2d4d'}`,
                borderRadius: 16,
                overflow: 'hidden',
              }}>
                {/* Card header */}
                <div style={{
                  padding: '16px 22px',
                  background: isCompleted ? 'rgba(34,197,94,0.04)' : isInProgress ? 'rgba(79,142,247,0.04)' : '#0a1322',
                  borderBottom: '1px solid #1e2d4d',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${color}20`,
                      border: `1px solid ${color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800, color,
                    }}>#{idx + 1}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#e8edf7' }}>{task.skill}</span>
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>
                      <div style={{ fontSize: 12, color: '#8b9dc3' }}>{task.estimatedDays} days estimated</div>
                    </div>
                  </div>
                  {/* Status controls */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['pending', 'in-progress', 'completed'] as EvidenceTask['status'][]).map(s => (
                      <button
                        key={s}
                        onClick={() => onUpdateTask(task.skill, s)}
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          background: task.status === s
                            ? s === 'completed' ? 'rgba(34,197,94,0.2)' : s === 'in-progress' ? 'rgba(79,142,247,0.2)' : 'rgba(139,157,195,0.2)'
                            : 'transparent',
                          border: `1px solid ${task.status === s
                            ? s === 'completed' ? '#22c55e' : s === 'in-progress' ? '#4f8ef7' : '#8b9dc3'
                            : '#1e2d4d'}`,
                          color: task.status === s
                            ? s === 'completed' ? '#22c55e' : s === 'in-progress' ? '#4f8ef7' : '#8b9dc3'
                            : '#8b9dc3',
                        }}
                      >
                        {s === 'pending' ? '⏳ Pending' : s === 'in-progress' ? '🔄 In Progress' : '✅ Done'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '18px 22px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#e8edf7', marginBottom: 8 }}>{task.project}</div>
                    <p style={{ margin: '0 0 14px', fontSize: 13, color: '#8b9dc3', lineHeight: 1.6 }}>{task.description}</p>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#8b9dc3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Deliverables</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {task.deliverables.map(d => (
                        <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: 4,
                            background: isCompleted ? 'rgba(34,197,94,0.2)' : '#1e2d4d',
                            border: `1px solid ${isCompleted ? '#22c55e' : '#2a3f6b'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, color: '#22c55e', flexShrink: 0,
                          }}>
                            {isCompleted ? '✓' : ''}
                          </div>
                          <span style={{ fontSize: 13, color: '#8b9dc3', textDecoration: isCompleted ? 'line-through' : 'none' }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{ textAlign: 'center', paddingTop: 4 }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%',
                      background: isCompleted ? 'rgba(34,197,94,0.15)' : isInProgress ? 'rgba(79,142,247,0.1)' : '#1e2d4d',
                      border: `2px solid ${isCompleted ? '#22c55e' : isInProgress ? '#4f8ef7' : '#2a3f6b'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, margin: '0 auto 6px',
                    }}>
                      {isCompleted ? '✅' : isInProgress ? '🔄' : '📋'}
                    </div>
                    <div style={{ fontSize: 11, color: '#8b9dc3', textTransform: 'capitalize' }}>
                      {task.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
