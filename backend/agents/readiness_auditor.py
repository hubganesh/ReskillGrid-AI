"""
Agent 6 — Readiness Auditor Agent
Evaluates student readiness holistically and produces a final score.
"""


def run(skills: list[dict], evidence_tasks: list[dict], project_count: int, cert_count: int) -> dict:
    total = len(skills)
    if total == 0:
        return {"score": 0, "breakdown": {}, "strongAreas": [], "criticalGaps": [], "recommendations": []}

    met = sum(1 for s in skills if s["gap"] == 0)
    partial = sum(1 for s in skills if 0 < s["gap"] <= 1)
    skills_score = round(((met + partial * 0.5) / total) * 100)

    completed_evidence = sum(1 for t in evidence_tasks if t["status"] == "completed")
    evidence_score = round((completed_evidence / len(evidence_tasks)) * 100) if evidence_tasks else 50

    strong_count = sum(1 for s in skills if s.get("currentLevel", 0) >= 3)
    projects_score = round((strong_count / total) * 100)

    # Resume/profile score: baseline + boost for projects and certs
    resume_score = min(85, 50 + project_count * 5 + cert_count * 5)

    overall = round(skills_score * 0.4 + evidence_score * 0.25 + projects_score * 0.2 + resume_score * 0.15)

    strong_areas = [s["name"] for s in skills if s["gap"] == 0 or s.get("currentLevel", 0) >= 4]
    critical_gaps = [s["name"] for s in skills if s["priority"] in ("Critical", "High")][:3]

    recommendations = []
    critical_skills = [s for s in skills if s["priority"] == "Critical"]
    if critical_skills:
        recommendations.append(
            f"Focus on {critical_skills[0]['name']} first — highest impact on your readiness score."
        )
    if evidence_tasks and completed_evidence < len(evidence_tasks):
        recommendations.append("Complete at least one evidence project to strengthen your portfolio.")
    if overall < 70:
        recommendations.append("Reassess after completing the top 2 evidence projects to track improvement.")
    recommendations.append("Update your resume with completed projects and measurable outcomes.")

    return {
        "score": overall,
        "breakdown": {
            "skillsScore": skills_score,
            "evidenceScore": evidence_score,
            "projectsScore": projects_score,
            "resumeScore": resume_score,
        },
        "strongAreas": strong_areas,
        "criticalGaps": critical_gaps,
        "recommendations": recommendations,
    }
