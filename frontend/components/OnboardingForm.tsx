'use client';
import { useState } from 'react';
import { TARGET_ROLES, SKILL_CATEGORIES } from '@/lib/agents';

interface ManualSkill {
  name: string;
  level: number;
  category: string;
}

interface Props {
  onSubmit: (data: {
    name: string;
    degree: string;
    college: string;
    targetRole: string;
    resumeText: string;
    academics: string[];
    projects: string[];
    certifications: string[];
    manualSkills: ManualSkill[];
  }) => void;
}

const DEMO_DATA = {
  name: 'Rahul Sharma',
  degree: 'B.Tech Computer Science',
  college: 'VIT University',
  targetRole: 'Data Analyst',
  resumeText: `Proficient in Python, SQL basics, Excel, and Statistics. Completed projects in data analysis using pandas and matplotlib. Familiar with Git and data visualization.`,
  academics: ['Data Structures', 'Statistics', 'Database Management', 'Machine Learning Basics', 'Python Programming'],
  projects: ['Student Performance Analytics using Python', 'Sales Data Analysis Dashboard using Excel'],
  certifications: ['Google Data Analytics Certificate', 'Python for Data Science – Coursera'],
  manualSkills: [
    { name: 'Python', level: 4, category: 'Technical' },
    { name: 'SQL', level: 2, category: 'Technical' },
    { name: 'Excel', level: 4, category: 'Tools' },
    { name: 'Statistics', level: 3, category: 'Domain' },
    { name: 'Power BI', level: 1, category: 'Tools' },
    { name: 'Communication', level: 2, category: 'Soft Skills' },
  ],
};

export default function OnboardingForm({ onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [targetRole, setTargetRole] = useState('Data Analyst');
  const [resumeText, setResumeText] = useState('');
  const [academicsText, setAcademicsText] = useState('');
  const [projectsText, setProjectsText] = useState('');
  const [certificationsText, setCertificationsText] = useState('');
  const [manualSkills, setManualSkills] = useState<ManualSkill[]>([
    { name: '', level: 3, category: 'Technical' },
  ]);

  function loadDemo() {
    setName(DEMO_DATA.name);
    setDegree(DEMO_DATA.degree);
    setCollege(DEMO_DATA.college);
    setTargetRole(DEMO_DATA.targetRole);
    setResumeText(DEMO_DATA.resumeText);
    setAcademicsText(DEMO_DATA.academics.join('\n'));
    setProjectsText(DEMO_DATA.projects.join('\n'));
    setCertificationsText(DEMO_DATA.certifications.join('\n'));
    setManualSkills(DEMO_DATA.manualSkills);
  }

  function addSkillRow() {
    setManualSkills(prev => [...prev, { name: '', level: 3, category: 'Technical' }]);
  }

  function updateSkill(idx: number, field: keyof ManualSkill, value: string | number) {
    setManualSkills(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  function removeSkill(idx: number) {
    setManualSkills(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit() {
    onSubmit({
      name: name || 'Student',
      degree: degree || 'B.Tech',
      college: college || 'University',
      targetRole,
      resumeText,
      academics: academicsText.split('\n').map(s => s.trim()).filter(Boolean),
      projects: projectsText.split('\n').map(s => s.trim()).filter(Boolean),
      certifications: certificationsText.split('\n').map(s => s.trim()).filter(Boolean),
      manualSkills: manualSkills.filter(s => s.name.trim()),
    });
  }

  const inputStyle: React.CSSProperties = {
    background: '#0a0f1e',
    border: '1px solid #1e2d4d',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#e8edf7',
    fontSize: 14,
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#8b9dc3',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: 6, display: 'block',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #4f8ef7, #7c5cd8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>⚡</div>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#e8edf7' }}>ReskillGrid AI</span>
        </div>
        <p style={{ color: '#8b9dc3', fontSize: 14 }}>Map your skills. Close the gaps. Prove your readiness.</p>
      </div>

      <div style={{
        background: '#0f1629',
        border: '1px solid #1e2d4d',
        borderRadius: 20,
        width: '100%',
        maxWidth: 640,
        overflow: 'hidden',
      }}>
        {/* Step indicator */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #1e2d4d', display: 'flex', alignItems: 'center', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step === s ? 'linear-gradient(135deg,#4f8ef7,#7c5cd8)' : step > s ? '#22c55e' : '#1e2d4d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>{step > s ? '✓' : s}</div>
              <span style={{ fontSize: 12, color: step === s ? '#4f8ef7' : '#8b9dc3' }}>
                {s === 1 ? 'Profile' : s === 2 ? 'Background' : 'Skills'}
              </span>
              {s < 3 && <div style={{ width: 24, height: 1, background: '#1e2d4d' }} />}
            </div>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={loadDemo} style={{
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(79,142,247,0.12)',
              border: '1px solid rgba(79,142,247,0.3)',
              color: '#4f8ef7', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              Load Demo ⚡
            </button>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8edf7', margin: 0 }}>Your Profile</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma" />
                </div>
                <div>
                  <label style={labelStyle}>College / University</label>
                  <input style={inputStyle} value={college} onChange={e => setCollege(e.target.value)} placeholder="VIT University" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Degree & Branch</label>
                <input style={inputStyle} value={degree} onChange={e => setDegree(e.target.value)} placeholder="B.Tech Computer Science" />
              </div>
              <div>
                <label style={labelStyle}>Target Role</label>
                <select style={inputStyle} value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                  {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8edf7', margin: 0 }}>Background & Experience</h2>
              <div>
                <label style={labelStyle}>Resume / Summary (paste text or describe your experience)</label>
                <textarea
                  style={{ ...inputStyle, height: 100, resize: 'vertical', fontFamily: 'inherit' }}
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Describe your experience, internships, work history..."
                />
              </div>
              <div>
                <label style={labelStyle}>Academic Subjects (one per line)</label>
                <textarea
                  style={{ ...inputStyle, height: 80, resize: 'vertical', fontFamily: 'inherit' }}
                  value={academicsText}
                  onChange={e => setAcademicsText(e.target.value)}
                  placeholder="Data Structures&#10;Statistics&#10;Database Management"
                />
              </div>
              <div>
                <label style={labelStyle}>Projects (one per line)</label>
                <textarea
                  style={{ ...inputStyle, height: 70, resize: 'vertical', fontFamily: 'inherit' }}
                  value={projectsText}
                  onChange={e => setProjectsText(e.target.value)}
                  placeholder="Student Performance Analytics using Python&#10;Sales Dashboard in Excel"
                />
              </div>
              <div>
                <label style={labelStyle}>Certifications (one per line)</label>
                <textarea
                  style={{ ...inputStyle, height: 60, resize: 'vertical', fontFamily: 'inherit' }}
                  value={certificationsText}
                  onChange={e => setCertificationsText(e.target.value)}
                  placeholder="Google Data Analytics Certificate&#10;Python for Data Science"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8edf7', margin: 0 }}>Your Current Skills</h2>
                <button onClick={addSkillRow} style={{
                  padding: '6px 14px', borderRadius: 8,
                  background: 'rgba(79,142,247,0.12)',
                  border: '1px solid rgba(79,142,247,0.3)',
                  color: '#4f8ef7', fontSize: 12, cursor: 'pointer',
                }}>+ Add Skill</button>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#8b9dc3' }}>
                Rate your current proficiency (1 = Beginner, 5 = Expert). Only add skills you genuinely have.
              </p>

              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.4fr 36px', gap: 8, padding: '0 4px' }}>
                {['Skill Name', 'Level (1–5)', 'Category', ''].map(h => (
                  <span key={h} style={{ fontSize: 11, color: '#8b9dc3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                {manualSkills.map((skill, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.4fr 36px', gap: 8, alignItems: 'center' }}>
                    <input
                      style={inputStyle}
                      value={skill.name}
                      onChange={e => updateSkill(idx, 'name', e.target.value)}
                      placeholder="Python, SQL..."
                    />
                    <input
                      type="number" min={1} max={5}
                      style={inputStyle}
                      value={skill.level}
                      onChange={e => updateSkill(idx, 'level', parseInt(e.target.value) || 1)}
                    />
                    <select style={inputStyle} value={skill.category} onChange={e => updateSkill(idx, 'category', e.target.value)}>
                      {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => removeSkill(idx)} style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444', fontSize: 14, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid #1e2d4d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            style={{
              padding: '10px 22px', borderRadius: 10,
              background: 'transparent', border: '1px solid #1e2d4d',
              color: '#8b9dc3', fontSize: 14, cursor: 'pointer',
              opacity: step === 1 ? 0.4 : 1,
            }}
            disabled={step === 1}
          >← Back</button>

          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} style={{
              padding: '10px 28px', borderRadius: 10,
              background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)',
              border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: 'pointer',
            }}>Continue →</button>
          ) : (
            <button onClick={handleSubmit} style={{
              padding: '12px 32px', borderRadius: 10,
              background: 'linear-gradient(135deg,#4f8ef7,#7c5cd8)',
              border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: 'pointer',
            }}>🚀 Analyze My Skills</button>
          )}
        </div>
      </div>
    </div>
  );
}
