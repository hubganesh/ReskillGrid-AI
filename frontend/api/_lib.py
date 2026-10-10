"""
_lib.py — Shared logic for all ReskillGrid AI serverless functions.
All 6 agents + knowledge base inlined here so each api/*.py can simply
do `from _lib import run_analysis` with zero external imports.
"""
from __future__ import annotations
from typing import Any

# ── Knowledge base ────────────────────────────────────────────────────────────

JOB_REQUIREMENTS: dict[str, list[dict]] = {
    "Data Analyst": [
        {"skill": "SQL",                "level": 4, "category": "Technical"},
        {"skill": "Python",             "level": 4, "category": "Technical"},
        {"skill": "Power BI",           "level": 4, "category": "Tools"},
        {"skill": "Excel",              "level": 3, "category": "Tools"},
        {"skill": "Statistics",         "level": 4, "category": "Domain"},
        {"skill": "Data Visualization", "level": 4, "category": "Technical"},
        {"skill": "Communication",      "level": 4, "category": "Soft Skills"},
        {"skill": "Problem Solving",    "level": 4, "category": "Soft Skills"},
    ],
    "Software Engineer": [
        {"skill": "Python",             "level": 4, "category": "Technical"},
        {"skill": "Data Structures",    "level": 5, "category": "Technical"},
        {"skill": "System Design",      "level": 4, "category": "Technical"},
        {"skill": "SQL",                "level": 3, "category": "Technical"},
        {"skill": "Git",                "level": 4, "category": "Tools"},
        {"skill": "REST APIs",          "level": 4, "category": "Technical"},
        {"skill": "Communication",      "level": 3, "category": "Soft Skills"},
        {"skill": "Problem Solving",    "level": 5, "category": "Soft Skills"},
    ],
    "Machine Learning Engineer": [
        {"skill": "Python",             "level": 5, "category": "Technical"},
        {"skill": "Machine Learning",   "level": 5, "category": "Domain"},
        {"skill": "Statistics",         "level": 4, "category": "Domain"},
        {"skill": "Deep Learning",      "level": 4, "category": "Domain"},
        {"skill": "SQL",                "level": 3, "category": "Technical"},
        {"skill": "Data Visualization", "level": 3, "category": "Technical"},
        {"skill": "Git",                "level": 4, "category": "Tools"},
        {"skill": "Communication",      "level": 3, "category": "Soft Skills"},
    ],
    "Business Analyst": [
        {"skill": "SQL",                "level": 3, "category": "Technical"},
        {"skill": "Excel",              "level": 4, "category": "Tools"},
        {"skill": "Power BI",           "level": 3, "category": "Tools"},
        {"skill": "Statistics",         "level": 3, "category": "Domain"},
        {"skill": "Communication",      "level": 5, "category": "Soft Skills"},
        {"skill": "Problem Solving",    "level": 5, "category": "Soft Skills"},
        {"skill": "Python",             "level": 2, "category": "Technical"},
        {"skill": "Data Visualization", "level": 3, "category": "Technical"},
    ],
    "Full Stack Developer": [
        {"skill": "JavaScript",         "level": 5, "category": "Technical"},
        {"skill": "React",              "level": 4, "category": "Technical"},
        {"skill": "Node.js",            "level": 4, "category": "Technical"},
        {"skill": "SQL",                "level": 3, "category": "Technical"},
        {"skill": "REST APIs",          "level": 4, "category": "Technical"},
        {"skill": "Git",                "level": 4, "category": "Tools"},
        {"skill": "CSS",                "level": 4, "category": "Technical"},
        {"skill": "System Design",      "level": 3, "category": "Technical"},
    ],
}

EVIDENCE_TEMPLATES: dict[str, dict] = {
    "SQL": {
        "project": "E-commerce Customer Analytics Database",
        "description": "Build a relational database for an e-commerce platform, write 20+ analytical queries, and extract business insights.",
        "deliverables": ["Normalized schema (ERD)", "20+ SQL queries", "Insights report", "GitHub repository"],
        "days": 7,
    },
    "Python": {
        "project": "Automated Data Analysis Pipeline",
        "description": "Create a Python pipeline: ingest raw CSV, clean it, run statistical analysis, generate automated reports.",
        "deliverables": ["Python scripts", "Pandas/NumPy analysis", "Matplotlib visualizations", "GitHub README"],
        "days": 10,
    },
    "Power BI": {
        "project": "Interactive Sales Performance Dashboard",
        "description": "Build an end-to-end Power BI dashboard with KPIs, trend analysis, and drill-through reports.",
        "deliverables": ["Power BI .pbix file", "Dashboard screenshots", "Business narrative", "LinkedIn post"],
        "days": 5,
    },
    "Machine Learning": {
        "project": "Predictive Analytics Capstone",
        "description": "Build, train and evaluate an ML model on a real dataset. Document problem, methodology, results, business impact.",
        "deliverables": ["Jupyter notebook", "Model evaluation metrics", "Business interpretation", "GitHub repository"],
        "days": 14,
    },
    "Statistics": {
        "project": "Statistical Analysis Case Study",
        "description": "Apply hypothesis testing, regression, and correlation to a real-world dataset. Present findings clearly.",
        "deliverables": ["Statistical analysis notebook", "Visualizations", "Written findings", "Slide presentation"],
        "days": 6,
    },
    "Data Visualization": {
        "project": "Storytelling with Data Portfolio",
        "description": "Create a portfolio with 3 distinct dashboards, each communicating a clear business insight.",
        "deliverables": ["3 visualization artifacts", "Narrative for each", "Tool: Python/Power BI/Tableau", "Portfolio link"],
        "days": 7,
    },
    "Communication": {
        "project": "Data Presentation & Storytelling Assessment",
        "description": "Record a 10-minute presentation explaining a technical analysis to a non-technical audience.",
        "deliverables": ["Recorded presentation (10 min)", "Slide deck", "Executive summary", "Self-review notes"],
        "days": 4,
    },
    "Excel": {
        "project": "Advanced Excel Financial Dashboard",
        "description": "Build an Excel dashboard with pivot tables, advanced formulas (VLOOKUP, INDEX-MATCH), and dynamic charts.",
        "deliverables": ["Excel workbook with formulas", "Pivot table analysis", "Dynamic charts", "Screenshot walkthrough"],
        "days": 4,
    },
    "System Design": {
        "project": "System Design Document for a Scalable App",
        "description": "Design the architecture for a scalable web application. Cover databases, APIs, caching, and deployment.",
        "deliverables": ["Architecture diagram", "Component breakdown", "Database schema", "Written design doc"],
        "days": 5,
    },
    "Git": {
        "project": "Open Source Contribution or GitHub Portfolio",
        "description": "Maintain a professional GitHub profile with well-documented repositories or contribute to open source.",
        "deliverables": ["3+ public repositories", "README files", "Commit history", "Portfolio README"],
        "days": 5,
    },
}

KEYWORD_SKILL_MAP: dict[str, tuple[str, int, str]] = {
    "python":           ("Python", 3, "Technical"),
    "sql":              ("SQL", 2, "Technical"),
    "power bi":         ("Power BI", 1, "Tools"),
    "powerbi":          ("Power BI", 1, "Tools"),
    "excel":            ("Excel", 3, "Tools"),
    "machine learning": ("Machine Learning", 2, "Domain"),
    "statistics":       ("Statistics", 3, "Domain"),
    "javascript":       ("JavaScript", 2, "Technical"),
    "react":            ("React", 2, "Technical"),
    "git":              ("Git", 3, "Tools"),
    "communication":    ("Communication", 2, "Soft Skills"),
    "data visualization": ("Data Visualization", 2, "Technical"),
    "node.js":          ("Node.js", 2, "Technical"),
    "nodejs":           ("Node.js", 2, "Technical"),
    "css":              ("CSS", 2, "Technical"),
    "rest api":         ("REST APIs", 2, "Technical"),
    "problem solving":  ("Problem Solving", 3, "Soft Skills"),
    "deep learning":    ("Deep Learning", 2, "Domain"),
    "system design":    ("System Design", 2, "Technical"),
}

# ── Agent helpers ─────────────────────────────────────────────────────────────

def _compute_priority(gap: int, required_level: int) -> str:
    score = gap * required_level
    if score >= 12:
        return "Critical"
    if score >= 8:
        return "High"
    if score >= 4:
        return "Medium"
    return "Low"


def _evidence_label(current_level: int) -> str:
    if current_level == 0:
        return "None"
    if current_level <= 2:
        return "Needs project"
    if current_level <= 3:
        return "Basic evidence"
    return "Moderate evidence"


# ── Agent 1: Skill Extraction ─────────────────────────────────────────────────

def agent_skill_extraction(
    name: str,
    degree: str,
    college: str,
    target_role: str,
    resume_text: str,
    academics: list[str],
    projects: list[str],
    certifications: list[str],
    manual_skills: list[dict[str, Any]],
) -> dict[str, Any]:
    requirements = JOB_REQUIREMENTS.get(target_role, JOB_REQUIREMENTS["Data Analyst"])

    skill_map: dict[str, dict[str, Any]] = {}
    for s in manual_skills:
        if s.get("name"):
            skill_map[s["name"]] = {
                "level": max(1, min(5, int(s.get("level", 3)))),
                "category": s.get("category", "Technical"),
            }

    combined = " ".join([resume_text] + academics + projects + certifications).lower()
    for keyword, (skill_name, default_level, category) in KEYWORD_SKILL_MAP.items():
        if keyword in combined and skill_name not in skill_map:
            skill_map[skill_name] = {"level": default_level, "category": category}

    skills: list[dict[str, Any]] = []
    for req in requirements:
        skill_name = req["skill"]
        info = skill_map.get(skill_name, {"level": 0, "category": req["category"]})
        current = info["level"]
        gap = max(0, req["level"] - current)
        skills.append({
            "name": skill_name,
            "currentLevel": current,
            "requiredLevel": req["level"],
            "gap": gap,
            "priority": _compute_priority(gap, req["level"]),
            "evidence": _evidence_label(current),
            "category": req["category"],
        })

    return {
        "name": name or "Student",
        "degree": degree or "Graduate",
        "college": college or "University",
        "targetRole": target_role,
        "skills": skills,
        "projectCount": len(projects),
        "certificationCount": len(certifications),
    }


# ── Agent 2: Industry Intelligence ───────────────────────────────────────────

def agent_industry_intelligence(target_role: str) -> dict[str, Any]:
    return {
        "targetRole": target_role,
        "requirements": JOB_REQUIREMENTS.get(target_role, JOB_REQUIREMENTS["Data Analyst"]),
        "availableRoles": list(JOB_REQUIREMENTS.keys()),
    }


# ── Agent 3: Gap Analysis ─────────────────────────────────────────────────────

def agent_gap_analysis(skills: list[dict]) -> dict[str, Any]:
    return {
        "missingSkills":  [s for s in skills if s["currentLevel"] == 0],
        "weakSkills":     [s for s in skills if s["gap"] > 0 and s["currentLevel"] > 0],
        "strongSkills":   [s for s in skills if s["gap"] == 0],
        "totalGaps":      len([s for s in skills if s["gap"] > 0]),
        "totalMet":       len([s for s in skills if s["gap"] == 0]),
    }


# ── Agent 4: Priority Agent ───────────────────────────────────────────────────

_PRIORITY_ORDER = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}

def agent_priority(skills: list[dict]) -> list[dict]:
    return sorted(skills, key=lambda s: (_PRIORITY_ORDER.get(s["priority"], 0), s["gap"]), reverse=True)


# ── Agent 5: Evidence Builder ─────────────────────────────────────────────────

def agent_evidence_builder(skills: list[dict]) -> list[dict]:
    tasks = []
    for skill in [s for s in skills if s["gap"] > 0][:5]:
        name = skill["name"]
        t = EVIDENCE_TEMPLATES.get(name, {
            "project": f"{name} Practical Project",
            "description": f"Build a hands-on project demonstrating {name} proficiency through a real-world use case.",
            "deliverables": ["Working project", "Documentation", "GitHub repository", "Presentation/demo"],
            "days": 7,
        })
        tasks.append({
            "skill": name,
            "priority": skill["priority"],
            "project": t["project"],
            "description": t["description"],
            "deliverables": t["deliverables"],
            "estimatedDays": t["days"],
            "status": "pending",
        })
    return tasks


# ── Agent 6: Readiness Auditor ────────────────────────────────────────────────

def agent_readiness_auditor(
    skills: list[dict],
    evidence_tasks: list[dict],
    resume_text: str = "",
    projects: list[str] | None = None,
    certifications: list[str] | None = None,
) -> dict[str, Any]:
    total = len(skills)
    if total == 0:
        return {"score": 0, "projectedScore": 0, "breakdown": {}, "strongAreas": [], "criticalGaps": [], "recommendations": []}

    projects       = projects or []
    certifications = certifications or []

    met     = sum(1 for s in skills if s["gap"] == 0)
    # Gap of exactly 1 = partial credit (warning); gap > 1 = significant gap
    partial = sum(1 for s in skills if s["gap"] == 1)
    skills_score = round(((met + partial * 0.5) / total) * 100)

    # Evidence: baseline 55 (submitted real profile), scales up with completions
    completed   = sum(1 for t in evidence_tasks if t["status"] == "completed")
    in_progress = sum(1 for t in evidence_tasks if t["status"] == "in-progress")
    evidence_base = 55
    if evidence_tasks:
        evidence_score = min(100, evidence_base + round(
            ((completed + in_progress * 0.3) / len(evidence_tasks)) * 45
        ))
    else:
        evidence_score = evidence_base

    # Projects: skills with current level >= 3 have supporting evidence
    strong_count   = sum(1 for s in skills if s.get("currentLevel", 0) >= 3)
    projects_score = round((strong_count / total) * 100)

    # Resume richness
    has_resume    = len(resume_text) > 30
    resume_score  = min(92, 50 + (15 if has_resume else 0) + len(projects) * 8 + len(certifications) * 5)

    # Weighted overall — weights tuned so a real partial student lands ~60-65%
    overall = round(skills_score * 0.30 + evidence_score * 0.25 + projects_score * 0.25 + resume_score * 0.20)

    # Projected: if all evidence tasks were completed
    all_done_evidence_score = min(100, evidence_base + 45)
    projected = min(98, round(
        skills_score * 0.30 + all_done_evidence_score * 0.25 + projects_score * 0.25 + resume_score * 0.20
    ))

    strong_areas  = [s["name"] for s in skills if s["gap"] == 0 or s.get("currentLevel", 0) >= 4]
    critical_gaps = [s["name"] for s in skills if s["priority"] in ("Critical", "High")][:3]

    recommendations: list[str] = []
    critical = [s for s in skills if s["priority"] == "Critical"]
    if critical:
        recommendations.append(f"Focus on {critical[0]['name']} first — highest impact on your readiness score.")
    if evidence_tasks and completed < len(evidence_tasks):
        recommendations.append("Complete at least one evidence project to strengthen your portfolio.")
    if overall < 70:
        recommendations.append("Reassess after completing the top 2 evidence projects to track improvement.")
    recommendations.append("Update your resume with completed projects and measurable outcomes.")

    return {
        "score":          overall,
        "projectedScore": projected,
        "breakdown": {
            "skillsScore":    skills_score,
            "evidenceScore":  evidence_score,
            "projectsScore":  projects_score,
            "resumeScore":    resume_score,
        },
        "strongAreas":     strong_areas,
        "criticalGaps":    critical_gaps,
        "recommendations": recommendations,
    }


# ── Master orchestrator ───────────────────────────────────────────────────────

def run_analysis(payload: dict[str, Any]) -> dict[str, Any]:
    """Run all 6 agents and return the full result."""
    profile = agent_skill_extraction(
        name=payload.get("name", ""),
        degree=payload.get("degree", ""),
        college=payload.get("college", ""),
        target_role=payload.get("targetRole", "Data Analyst"),
        resume_text=payload.get("resumeText", ""),
        academics=payload.get("academics", []),
        projects=payload.get("projects", []),
        certifications=payload.get("certifications", []),
        manual_skills=payload.get("manualSkills", []),
    )

    prioritized = agent_priority(profile["skills"])
    gap         = agent_gap_analysis(prioritized)
    evidence    = agent_evidence_builder(prioritized)
    intel       = agent_industry_intelligence(payload.get("targetRole", "Data Analyst"))
    audit       = agent_readiness_auditor(
        skills=prioritized,
        evidence_tasks=evidence,
        resume_text=payload.get("resumeText", ""),
        projects=payload.get("projects", []),
        certifications=payload.get("certifications", []),
    )

    return {
        "studentProfile": {
            "name":              profile["name"],
            "degree":            profile["degree"],
            "college":           profile["college"],
            "targetRole":        profile["targetRole"],
            "projectCount":      profile["projectCount"],
            "certificationCount": profile["certificationCount"],
        },
        "skillGrid":            prioritized,
        "topPriorityGaps":      [s for s in prioritized if s["gap"] > 0][:3],
        "gapSummary":           {"missing": gap["totalGaps"], "met": gap["totalMet"]},
        "evidencePlan":         evidence,
        "readinessScore":       audit["score"],
        "projectedScore":       audit["projectedScore"],
        "readinessBreakdown":   audit["breakdown"],
        "strongAreas":          audit["strongAreas"],
        "criticalGaps":         audit["criticalGaps"],
        "recommendations":      audit["recommendations"],
        "targetRole":           payload.get("targetRole", "Data Analyst"),
        "industryRequirements": intel["requirements"],
    }
