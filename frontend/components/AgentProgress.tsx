'use client';
import { AgentStatus } from '@/lib/types';

interface Props {
  agents: AgentStatus[];
}

const agentIcons: Record<string, string> = {
  'Skill Extraction Agent': '🧠',
  'Industry Intelligence Agent': '🏭',
  'Gap Analysis Agent': '🔍',
  'Priority Agent': '🎯',
  'Evidence Builder Agent': '🛠️',
  'Readiness Auditor Agent': '✅',
};

export default function AgentProgress({ agents }: Props) {
  return (
    <div style={{
      background: '#0f1629',
      border: '1px solid #1e2d4d',
      borderRadius: 16,
      padding: '24px',
      maxWidth: 520,
      width: '100%',
    }}>
      <div style={{ fontSize: 13, color: '#8b9dc3', marginBottom: 20, textAlign: 'center' }}>
        Running 6 AI Agents...
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {agents.map((agent, i) => (
          <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Icon */}
            <div style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: agent.status === 'done' ? 'rgba(34,197,94,0.15)'
                : agent.status === 'running' ? 'rgba(79,142,247,0.15)'
                : 'rgba(30,45,77,0.5)',
              border: `1px solid ${agent.status === 'done' ? '#22c55e44' : agent.status === 'running' ? '#4f8ef744' : '#1e2d4d'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
              transition: 'all 0.3s ease',
            }}>
              {agentIcons[agent.name] || '🤖'}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: agent.status === 'done' ? '#e8edf7'
                    : agent.status === 'running' ? '#4f8ef7'
                    : '#8b9dc3',
                }}>
                  {agent.name}
                </span>
                {agent.status === 'done' && (
                  <span style={{ fontSize: 11, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '1px 7px', borderRadius: 9999 }}>Done</span>
                )}
                {agent.status === 'running' && (
                  <span style={{ fontSize: 11, color: '#4f8ef7', background: 'rgba(79,142,247,0.1)', padding: '1px 7px', borderRadius: 9999 }}>Running</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: '#8b9dc3' }}>{agent.message}</div>
              {/* Progress bar */}
              <div style={{ height: 3, background: '#1e2d4d', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: agent.status === 'done' ? '100%' : agent.status === 'running' ? '60%' : '0%',
                  background: agent.status === 'done' ? '#22c55e' : '#4f8ef7',
                  borderRadius: 3,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
