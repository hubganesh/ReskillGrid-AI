'use client';
import { useState, useCallback } from 'react';
import { AppStep, GapAnalysisResult, EvidenceTask } from '@/lib/types';
import { runReskillGridAnalysis } from '@/lib/agents';
import OnboardingForm from '@/components/OnboardingForm';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import SkillGrid from '@/components/SkillGrid';
import PriorityAnalysis from '@/components/PriorityAnalysis';
import EvidencePlan from '@/components/EvidencePlan';
import ReadinessReport from '@/components/ReadinessReport';

export default function Home() {
  const [step, setStep] = useState<AppStep>('onboarding');
  const [result, setResult] = useState<GapAnalysisResult | null>(null);

  function handleOnboardingSubmit(data: Parameters<typeof runReskillGridAnalysis>[0]) {
    const analysisResult = runReskillGridAnalysis(data);
    setResult(analysisResult);
    setStep('analyzing');
  }

  const handleAnalysisComplete = useCallback(() => {
    setStep('skillgrid');
  }, []);

  function handleUpdateTask(skill: string, status: EvidenceTask['status']) {
    if (!result) return;
    setResult(prev => {
      if (!prev) return prev;
      const updatedPlan = prev.evidencePlan.map(t => t.skill === skill ? { ...t, status } : t);
      // Recompute evidence score using the same formula as the auditor (evidenceBase=55)
      const completed   = updatedPlan.filter(t => t.status === 'completed').length;
      const inProgress  = updatedPlan.filter(t => t.status === 'in-progress').length;
      const evidenceBase = 55;
      const newEvidenceScore = Math.min(100, evidenceBase + Math.round(
        ((completed + inProgress * 0.3) / updatedPlan.length) * 45,
      ));
      const { skillsScore, projectsScore, resumeScore } = prev.readinessBreakdown;
      const newScore = Math.round(
        skillsScore * 0.30 + newEvidenceScore * 0.25 + projectsScore * 0.25 + resumeScore * 0.20,
      );
      return {
        ...prev,
        evidencePlan: updatedPlan,
        readinessScore: newScore,
        readinessBreakdown: { ...prev.readinessBreakdown, evidenceScore: newEvidenceScore },
      };
    });
  }

  function handleRestart() {
    setResult(null);
    setStep('onboarding');
  }

  // Navigation helpers
  const navTo = (s: AppStep) => setStep(s);

  if (step === 'onboarding') {
    return <OnboardingForm onSubmit={handleOnboardingSubmit} />;
  }

  if (step === 'analyzing') {
    return <AnalyzingScreen onComplete={handleAnalysisComplete} />;
  }

  if (!result) {
    return <div style={{ color: '#e8edf7', padding: 40 }}>Something went wrong. <button onClick={handleRestart}>Restart</button></div>;
  }

  if (step === 'skillgrid') {
    return (
      <SkillGrid
        skills={result.skillGrid}
        readinessScore={result.readinessScore}
        studentName={result.studentProfile.name}
        targetRole={result.targetRole}
        onNext={() => navTo('analysis')}
      />
    );
  }

  if (step === 'analysis') {
    return (
      <PriorityAnalysis
        topGaps={result.skillGrid}
        strongAreas={result.strongAreas}
        recommendations={result.recommendations}
        targetRole={result.targetRole}
        studentName={result.studentProfile.name}
        onNext={() => navTo('evidence')}
        onBack={() => navTo('skillgrid')}
      />
    );
  }

  if (step === 'evidence') {
    return (
      <EvidencePlan
        evidencePlan={result.evidencePlan}
        studentName={result.studentProfile.name}
        targetRole={result.targetRole}
        onNext={() => navTo('report')}
        onBack={() => navTo('analysis')}
        onUpdateTask={handleUpdateTask}
      />
    );
  }

  if (step === 'report') {
    return (
      <ReadinessReport
        result={result}
        onBack={() => navTo('evidence')}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}
