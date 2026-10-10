"""
ReskillGrid AI — FastAPI Backend
Orchestrates 6 AI agents to produce a complete skill gap analysis.
"""
from __future__ import annotations
import sys
import os

# Ensure local imports work
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from agents import skill_extraction, industry_intelligence, gap_analysis, priority_agent, evidence_builder, readiness_auditor
from data.knowledge_base import JOB_REQUIREMENTS

app = FastAPI(
    title="ReskillGrid AI API",
    description="Agentic AI platform for skill gap analysis and reskilling",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ──────────────────────────────────────────────────────────

class ManualSkill(BaseModel):
    name: str
    level: int = Field(ge=1, le=5)
    category: str = "Technical"


class AnalyzeRequest(BaseModel):
    name: str = ""
    degree: str = ""
    college: str = ""
    targetRole: str = "Data Analyst"
    resumeText: str = ""
    academics: list[str] = []
    projects: list[str] = []
    certifications: list[str] = []
    manualSkills: list[ManualSkill] = []


class UpdateTaskRequest(BaseModel):
    skill: str
    status: str  # pending | in-progress | completed


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "service": "ReskillGrid AI", "version": "1.0.0"}


@app.get("/roles")
def get_roles():
    """Return available target roles."""
    return {"roles": list(JOB_REQUIREMENTS.keys())}


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    """
    Master endpoint: runs all 6 agents and returns the full analysis.
    """
    # Agent 1: Skill Extraction
    profile = skill_extraction.run(
        name=req.name,
        degree=req.degree,
        college=req.college,
        target_role=req.targetRole,
        resume_text=req.resumeText,
        academics=req.academics,
        projects=req.projects,
        certifications=req.certifications,
        manual_skills=[s.model_dump() for s in req.manualSkills],
    )

    # Agent 2: Industry Intelligence
    intel = industry_intelligence.run(req.targetRole)

    # Agent 3: Gap Analysis
    gap = gap_analysis.run(profile["skills"])

    # Agent 4: Priority Agent
    prioritized_skills = priority_agent.run(profile["skills"])

    # Agent 5: Evidence Builder
    evidence_tasks = evidence_builder.run(prioritized_skills)

    # Agent 6: Readiness Auditor
    audit = readiness_auditor.run(
        skills=prioritized_skills,
        evidence_tasks=evidence_tasks,
        project_count=profile["projectCount"],
        cert_count=profile["certificationCount"],
    )

    return {
        "studentProfile": {
            "name": profile["name"],
            "degree": profile["degree"],
            "college": profile["college"],
            "targetRole": profile["targetRole"],
            "projectCount": profile["projectCount"],
            "certificationCount": profile["certificationCount"],
        },
        "skillGrid": prioritized_skills,
        "topPriorityGaps": [s for s in prioritized_skills if s["gap"] > 0][:3],
        "gapSummary": {
            "missing": gap["totalGaps"],
            "met": gap["totalMet"],
        },
        "evidencePlan": evidence_tasks,
        "readinessScore": audit["score"],
        "readinessBreakdown": audit["breakdown"],
        "strongAreas": audit["strongAreas"],
        "criticalGaps": audit["criticalGaps"],
        "recommendations": audit["recommendations"],
        "targetRole": req.targetRole,
        "industryRequirements": intel["requirements"],
    }


@app.post("/update-task")
def update_task(req: UpdateTaskRequest):
    """Acknowledge a task status update (state lives in frontend for MVP)."""
    if req.status not in ("pending", "in-progress", "completed"):
        raise HTTPException(400, "Invalid status")
    return {"skill": req.skill, "status": req.status, "acknowledged": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
