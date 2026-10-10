export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Skill {
  name: string;
  currentLevel: number; // 0–5
  requiredLevel: number; // 0–5
  gap: number;
  priority: PriorityLevel;
  evidence: string;
  category: string;
}

export interface EvidenceTask {
  skill: string;
  priority: PriorityLevel;
  project: string;
  description: string;
  deliverables: string[];
  estimatedDays: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface StudentProfile {
  name: string;
  degree: string;
  college: string;
  targetRole: string;
  resumeText: string;
  academics: string[];
  projects: string[];
  certifications: string[];
  skills: Skill[];
}

export interface GapAnalysisResult {
  studentProfile: StudentProfile;
  skillGrid: Skill[];
  topPriorityGaps: Skill[];
  evidencePlan: EvidenceTask[];
  readinessScore: number;
  projectedScore: number;
  readinessBreakdown: {
    skillsScore: number;
    evidenceScore: number;
    projectsScore: number;
    resumeScore: number;
  };
  strongAreas: string[];
  criticalGaps: string[];
  recommendations: string[];
  targetRole: string;
}

export interface AgentStatus {
  name: string;
  status: 'idle' | 'running' | 'done' | 'error';
  message: string;
}

export type AppStep = 'onboarding' | 'analyzing' | 'skillgrid' | 'analysis' | 'evidence' | 'report';
