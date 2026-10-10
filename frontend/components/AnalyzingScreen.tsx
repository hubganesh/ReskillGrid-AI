'use client';
import { useEffect, useState } from 'react';
import { AgentStatus } from '@/lib/types';
import AgentProgress from './AgentProgress';

interface Props {
  onComplete: () => void;
}

const AGENTS: { name: string; message: string }[] = [
  { name: 'Skill Extraction Agent', message: 'Parsing resume, academics, certifications, and projects...' },
  { name: 'Industry Intelligence Agent', message: 'Analyzing current job market requirements...' },
  { name: 'Gap Analysis Agent', message: 'Comparing your skills with industry expectations...' },
  { name: 'Priority Agent', message: 'Ranking gaps by impact: Demand × Gap × Role Importance...' },
  { name: 'Evidence Builder Agent', message: 'Generating project recommendations and evidence tasks...' },
  { name: 'Readiness Auditor Agent', message: 'Computing final readiness score and report...' },
];

export default function AnalyzingScreen({ onComplete }: Props) {
  const [agents, setAgents] = useState<AgentStatus[]>(
    AGENTS.map(a => ({ name: a.name, status: 'idle', message: 'Waiting...' }))
  );
  const [step, setStep] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current >= AGENTS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
        return;
      }

      setAgents(prev =>
        prev.map((a, i) => {
          if (i === current) return { ...a, status: 'running', message: AGENTS[i].message };
          if (i < current) return { ...a, status: 'done', message: 'Completed ✓' };
          return a;
        })
      );
      setStep(current);

      setTimeout(() => {
        setAgents(prev =>
          prev.map((a, i) => i === current ? { ...a, status: 'done', message: 'Completed ✓' } : a)
        );
        current++;
      }, 900);
    }, 1100);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progress = Math.round((step / AGENTS.length) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⚡</div>
          <span style={{ fontSize: 26, fontWeight: 800, color: '#e8edf7' }}>ReskillGrid AI</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e8edf7', margin: '0 0 8px' }}>Analyzing Your Profile</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#8b9dc3' }}>6 AI agents working together to map your skill gap...</p>
      </div>

      {/* Overall progress bar */}
      <div style={{ width: '100%', maxWidth: 520, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8b9dc3', marginBottom: 8 }}>
          <span>Overall Progress</span>
          <span style={{ fontWeight: 700, color: '#4f8ef7' }}>{progress}%</span>
        </div>
        <div style={{ height: 6, background: '#1e2d4d', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4f8ef7, #7c5cd8)',
            borderRadius: 3,
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      <AgentProgress agents={agents} />

      {/* Architecture hint */}
      <div style={{ marginTop: 32, textAlign: 'center', fontSize: 12, color: '#8b9dc3' }}>
        <div style={{ marginBottom: 8 }}>Agentic Pipeline</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Extract', 'Analyze', 'Compare', 'Prioritize', 'Evidence', 'Audit'].map((s, i, arr) => (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: i <= step ? '#4f8ef7' : '#1e2d4d', fontWeight: 600 }}>{s}</span>
              {i < arr.length - 1 && <span style={{ color: '#1e2d4d' }}>→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
