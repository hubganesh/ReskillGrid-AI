import { GapAnalysisResult, StudentProfile, EvidenceTask, Skill, PriorityLevel } from './types';

// Mock curated job description dataset for Data Analyst and similar roles
const JOB_REQUIREMENTS: Record<string, { skill: string; level: number; category: string }[]> = {
  'Data Analyst': [
    { skill: 'SQL', level: 4, category: 'Technical' },
    { skill: 'Python', level: 4, category: 'Technical' },
    { skill: 'Power BI', level: 4, category: 'Tools' },
    { skill: 'Excel', level: 3, category: 'Tools' },
    { skill: 'Statistics', level: 4, category: 'Domain' },
    { skill: 'Data Visualization', level: 4, category: 'Technical' },
    { skill: 'Communication', level: 4, category: 'Soft Skills' },
    { skill: 'Problem Solving', level: 4, category: 'Soft Skills' },
  ],
  'Software Engineer': [
    { skill: 'Python', level: 4, category: 'Technical' },
    { skill: 'Data Structures', level: 5, category: 'Technical' },
    { skill: 'System Design', level: 4, category: 'Technical' },
    { skill: 'SQL', level: 3, category: 'Technical' },
    { skill: 'Git', level: 4, category: 'Tools' },
    { skill: 'REST APIs', level: 4, category: 'Technical' },
    { skill: 'Communication', level: 3, category: 'Soft Skills' },
    { skill: 'Problem Solving', level: 5, category: 'Soft Skills' },
  ],
  'Machine Learning Engineer': [
    { skill: 'Python', level: 5, category: 'Technical' },
    { skill: 'Machine Learning', level: 5, category: 'Domain' },
    { skill: 'Statistics', level: 4, category: 'Domain' },
    { skill: 'Deep Learning', level: 4, category: 'Domain' },
    { skill: 'SQL', level: 3, category: 'Technical' },
    { skill: 'Data Visualization', level: 3, category: 'Technical' },
    { skill: 'Git', level: 4, category: 'Tools' },
    { skill: 'Communication', level: 3, category: 'Soft Skills' },
  ],
  'Business Analyst': [
    { skill: 'SQL', level: 3, category: 'Technical' },
    { skill: 'Excel', level: 4, category: 'Tools' },
    { skill: 'Power BI', level: 3, category: 'Tools' },
    { skill: 'Statistics', level: 3, category: 'Domain' },
    { skill: 'Communication', level: 5, category: 'Soft Skills' },
    { skill: 'Problem Solving', level: 5, category: 'Soft Skills' },
    { skill: 'Python', level: 2, category: 'Technical' },
    { skill: 'Data Visualization', level: 3, category: 'Technical' },
  ],
  'Full Stack Developer': [
    { skill: 'JavaScript', level: 5, category: 'Technical' },
    { skill: 'React', level: 4, category: 'Technical' },
    { skill: 'Node.js', level: 4, category: 'Technical' },
    { skill: 'SQL', level: 3, category: 'Technical' },
    { skill: 'REST APIs', level: 4, category: 'Technical' },
    { skill: 'Git', level: 4, category: 'Tools' },
    { skill: 'CSS', level: 4, category: 'Technical' },
    { skill: 'System Design', level: 3, category: 'Technical' },
  ],
};

const EVIDENCE_TEMPLATES: Record<string, { project: string; description: string; deliverables: string[]; days: number }> = {
  'SQL': {
    project: 'E-commerce Customer Analytics Database',
    description: 'Build a complete relational database for an e-commerce platform, write 20+ analytical queries, and extract actionable business insights.',
    deliverables: ['Normalized database schema (ERD)', '20+ analytical SQL queries', 'Business insights report', 'GitHub repository'],
    days: 7,
  },
  'Python': {
    project: 'Automated Data Analysis Pipeline',
    description: 'Create a Python pipeline that ingests raw CSV data, cleans it, runs statistical analysis, and generates automated reports.',
    deliverables: ['Python scripts with clean code', 'Pandas/NumPy analysis', 'Matplotlib visualizations', 'GitHub repository with README'],
    days: 10,
  },
  'Power BI': {
    project: 'Interactive Sales Performance Dashboard',
    description: 'Build an end-to-end Power BI dashboard with KPIs, trend analysis, and drill-through reports using real-world sales data.',
    deliverables: ['Power BI .pbix file', 'Dashboard screenshots', 'Business narrative report', 'LinkedIn post with insights'],
    days: 5,
  },
  'Machine Learning': {
    project: 'Predictive Analytics Capstone Project',
    description: 'Build, train, and evaluate an ML model on a real dataset. Document the problem, methodology, results, and business impact.',
    deliverables: ['Jupyter notebook', 'Model evaluation metrics', 'Business interpretation', 'GitHub repository'],
    days: 14,
  },
  'Statistics': {
    project: 'Statistical Analysis Case Study',
    description: 'Apply statistical methods (hypothesis testing, regression, correlation) to a real-world dataset and present findings.',
    deliverables: ['Statistical analysis notebook', 'Visualizations', 'Written findings report', 'Slide presentation'],
    days: 6,
  },
  'Data Visualization': {
    project: 'Storytelling with Data Portfolio',
    description: 'Create a data storytelling portfolio with 3 distinct dashboards or charts that each communicate a clear business insight.',
    deliverables: ['3 visualization artifacts', 'Narrative for each', 'Tool: Python / Power BI / Tableau', 'GitHub/portfolio link'],
    days: 7,
  },
  'Communication': {
    project: 'Data Presentation & Storytelling Assessment',
    description: 'Record a 10-minute presentation explaining a technical analysis to a non-technical audience. Focus on clarity and impact.',
    deliverables: ['Recorded presentation (10 min)', 'Slide deck', 'Written executive summary', 'Self-review notes'],
    days: 4,
  },
  'Excel': {
    project: 'Advanced Excel Financial Dashboard',
    description: 'Build an Excel dashboard with pivot tables, advanced formulas (VLOOKUP, INDEX-MATCH), and dynamic charts for financial data.',
    deliverables: ['Excel workbook with formulas', 'Pivot table analysis', 'Dynamic charts', 'Screenshot walkthrough'],
    days: 4,
  },
  'System Design': {
    project: 'System Design Document for Scalable App',
    description: 'Design the architecture for a scalable web application. Cover databases, APIs, caching, and deployment.',
    deliverables: ['Architecture diagram', 'Component breakdown', 'Database schema', 'Written design doc'],
    days: 5,
  },
  'Git': {
    project: 'Open Source Contribution or GitHub Portfolio',
    description: 'Contribute to an open source project or maintain a professional GitHub profile with well-documented repositories.',
    deliverables: ['3+ public repositories', 'README files', 'Commit history', 'Portfolio README'],
    days: 5,
  },
};

function computePriority(gap: number, requiredLevel: number): PriorityLevel {
  const score = gap * requiredLevel;
  if (score >= 12) return 'Critical';
  if (score >= 8) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

function getEvidenceLabel(currentLevel: number, skill: string): string {
  if (currentLevel === 0) return 'None';
  if (currentLevel <= 2) return 'Needs project';
  if (currentLevel <= 3) return 'Basic evidence';
  return 'Moderate evidence';
}

// Agent 1: Skill Extraction
export function skillExtractionAgent(input: {
  name: string;
  degree: string;
  college: string;
  targetRole: string;
  resumeText: string;
  academics: string[];
  projects: string[];
  certifications: string[];
  manualSkills: { name: string; level: number; category: string }[];
}): StudentProfile {
  const skills: Skill[] = [];
  const requirements = JOB_REQUIREMENTS[input.targetRole] || JOB_REQUIREMENTS['Data Analyst'];

  // Build skill map from manual input + keyword detection from resume
  const skillMap: Map<string, { level: number; category: string }> = new Map();

  input.manualSkills.forEach(s => {
    skillMap.set(s.name, { level: s.level, category: s.category });
  });

  // Simple keyword detection in resume text
  const resumeLower = (input.resumeText + ' ' + input.projects.join(' ') + ' ' + input.certifications.join(' ')).toLowerCase();
  const keywordSkills: { keyword: string; name: string; level: number; category: string }[] = [
    { keyword: 'python', name: 'Python', level: 3, category: 'Technical' },
    { keyword: 'sql', name: 'SQL', level: 2, category: 'Technical' },
    { keyword: 'power bi', name: 'Power BI', level: 1, category: 'Tools' },
    { keyword: 'excel', name: 'Excel', level: 3, category: 'Tools' },
    { keyword: 'machine learning', name: 'Machine Learning', level: 2, category: 'Domain' },
    { keyword: 'statistics', name: 'Statistics', level: 3, category: 'Domain' },
    { keyword: 'javascript', name: 'JavaScript', level: 2, category: 'Technical' },
    { keyword: 'react', name: 'React', level: 2, category: 'Technical' },
    { keyword: 'git', name: 'Git', level: 3, category: 'Tools' },
    { keyword: 'communication', name: 'Communication', level: 2, category: 'Soft Skills' },
    { keyword: 'data visualization', name: 'Data Visualization', level: 2, category: 'Technical' },
  ];

  keywordSkills.forEach(ks => {
    if (resumeLower.includes(ks.keyword) && !skillMap.has(ks.name)) {
      skillMap.set(ks.name, { level: ks.level, category: ks.category });
    }
  });

  // For each required skill, compute gap and priority
  requirements.forEach(req => {
    const current = skillMap.get(req.skill);
    const currentLevel = current ? current.level : 0;
    const gap = Math.max(0, req.level - currentLevel);
    skills.push({
      name: req.skill,
      currentLevel,
      requiredLevel: req.level,
      gap,
      priority: computePriority(gap, req.level),
      evidence: getEvidenceLabel(currentLevel, req.skill),
      category: req.category,
    });
  });

  return {
    name: input.name,
    degree: input.degree,
    college: input.college,
    targetRole: input.targetRole,
    resumeText: input.resumeText,
    academics: input.academics,
    projects: input.projects,
    certifications: input.certifications,
    skills,
  };
}

// Agent 2: Industry Intelligence (returns role requirements — built into JOB_REQUIREMENTS above)
export function industryIntelligenceAgent(targetRole: string) {
  return JOB_REQUIREMENTS[targetRole] || JOB_REQUIREMENTS['Data Analyst'];
}

// Agent 3: Gap Analysis
export function gapAnalysisAgent(skills: Skill[]) {
  return {
    missingSkills: skills.filter(s => s.currentLevel === 0),
    weakSkills: skills.filter(s => s.gap > 0 && s.currentLevel > 0),
    strongSkills: skills.filter(s => s.gap === 0),
    skillGrid: skills,
  };
}

// Agent 4: Priority Agent
export function priorityAgent(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => {
    const priorityOrder: Record<PriorityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (diff !== 0) return diff;
    return b.gap - a.gap;
  });
}

// Agent 5: Evidence Builder
export function evidenceBuilderAgent(skills: Skill[]): EvidenceTask[] {
  const gapSkills = skills.filter(s => s.gap > 0);
  const prioritized = priorityAgent(gapSkills);
  return prioritized.slice(0, 5).map(skill => {
    const template = EVIDENCE_TEMPLATES[skill.name] || {
      project: `${skill.name} Practical Project`,
      description: `Build a hands-on project demonstrating ${skill.name} proficiency through a real-world use case.`,
      deliverables: ['Working project', 'Documentation', 'GitHub repository', 'Presentation/demo'],
      days: 7,
    };
    return {
      skill: skill.name,
      priority: skill.priority,
      project: template.project,
      description: template.description,
      deliverables: template.deliverables,
      estimatedDays: template.days,
      status: 'pending',
    };
  });
}

// Agent 6: Readiness Auditor
export function readinessAuditorAgent(
  skills: Skill[],
  evidenceTasks: EvidenceTask[],
  profile?: { resumeText: string; projects: string[]; certifications: string[] },
): {
  score: number;
  breakdown: { skillsScore: number; evidenceScore: number; projectsScore: number; resumeScore: number };
  strongAreas: string[];
  criticalGaps: string[];
  recommendations: string[];
  projectedScore: number;
} {
  const totalSkills = skills.length;
  const metSkills    = skills.filter(s => s.gap === 0).length;
  // Gap of exactly 1 → partial credit (⚠️), gap > 1 → missing
  const partialSkills = skills.filter(s => s.gap === 1).length;
  const skillsScore = Math.round(((metSkills + partialSkills * 0.5) / totalSkills) * 100);

  // Evidence: baseline 55 (submitted a real profile), scales up with completed/in-progress tasks
  const completedEvidence  = evidenceTasks.filter(t => t.status === 'completed').length;
  const inProgressEvidence = evidenceTasks.filter(t => t.status === 'in-progress').length;
  const evidenceBase = 55;
  const evidenceScore = evidenceTasks.length > 0
    ? Math.min(100, evidenceBase + Math.round(((completedEvidence + inProgressEvidence * 0.3) / evidenceTasks.length) * 45))
    : evidenceBase;

  // Projects: skills with current level ≥ 3 have supporting evidence
  const hasProjects  = skills.filter(s => s.currentLevel >= 3).length;
  const projectsScore = Math.round((hasProjects / Math.max(totalSkills, 1)) * 100);

  // Resume: based on actual content richness, not a fixed number
  const projectCount = profile?.projects.length ?? 0;
  const certCount    = profile?.certifications.length ?? 0;
  const hasResume    = (profile?.resumeText?.length ?? 0) > 30;
  const resumeScore  = Math.min(92, 50 + (hasResume ? 15 : 0) + projectCount * 8 + certCount * 5);

  // Weights tuned so a real partial student lands ~60-65%
  const overallScore = Math.round(
    skillsScore * 0.30 + evidenceScore * 0.25 + projectsScore * 0.25 + resumeScore * 0.20,
  );

  // Projected score assuming all evidence tasks get completed
  const allDoneEvidenceScore = Math.min(100, evidenceBase + 45);
  const projectedScore = Math.min(98, Math.round(
    skillsScore * 0.30 + allDoneEvidenceScore * 0.25 + projectsScore * 0.25 + resumeScore * 0.20,
  ));

  const strongAreas  = skills.filter(s => s.gap === 0 || s.currentLevel >= 4).map(s => s.name);
  const criticalGaps = skills.filter(s => s.priority === 'Critical' || s.priority === 'High').map(s => s.name).slice(0, 3);

  const recommendations: string[] = [];
  const criticalSkills = skills.filter(s => s.priority === 'Critical');
  if (criticalSkills.length > 0) {
    recommendations.push(`Focus on ${criticalSkills[0].name} first — it has the largest impact on your target role.`);
  }
  if (completedEvidence < evidenceTasks.length) {
    recommendations.push('Complete at least one evidence-building project to strengthen your portfolio.');
  }
  if (overallScore < 70) {
    recommendations.push('Reassess after completing the top 2 evidence projects to track your improvement.');
  }
  recommendations.push('Update your resume with completed projects and measurable outcomes.');

  return {
    score: overallScore,
    breakdown: { skillsScore, evidenceScore, projectsScore, resumeScore },
    strongAreas,
    criticalGaps,
    recommendations,
    projectedScore,
  };
}

// Master orchestration function — runs all 6 agents
export function runReskillGridAnalysis(input: Parameters<typeof skillExtractionAgent>[0]): GapAnalysisResult {
  const studentProfile = skillExtractionAgent(input);
  const skillGrid = studentProfile.skills;
  const { missingSkills, weakSkills, strongSkills } = gapAnalysisAgent(skillGrid);
  const prioritizedSkills = priorityAgent(skillGrid);
  const evidencePlan = evidenceBuilderAgent(prioritizedSkills);
  const audit = readinessAuditorAgent(prioritizedSkills, evidencePlan, {
    resumeText: input.resumeText,
    projects: input.projects,
    certifications: input.certifications,
  });

  return {
    studentProfile,
    skillGrid: prioritizedSkills,
    topPriorityGaps: prioritizedSkills.filter(s => s.gap > 0).slice(0, 3),
    evidencePlan,
    readinessScore: audit.score,
    readinessBreakdown: audit.breakdown,
    strongAreas: audit.strongAreas,
    criticalGaps: audit.criticalGaps,
    recommendations: audit.recommendations,
    projectedScore: audit.projectedScore,
    targetRole: input.targetRole,
  };
}

export const TARGET_ROLES = Object.keys(JOB_REQUIREMENTS);
export const SKILL_CATEGORIES = ['Technical', 'Tools', 'Domain', 'Soft Skills'];
