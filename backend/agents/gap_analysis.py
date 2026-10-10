"""
Agent 3 — Gap Analysis Agent
Compares student skills vs industry requirements.
"""


def run(skills: list[dict]) -> dict:
    missing_skills = [s for s in skills if s["currentLevel"] == 0]
    weak_skills = [s for s in skills if s["gap"] > 0 and s["currentLevel"] > 0]
    strong_skills = [s for s in skills if s["gap"] == 0]

    return {
        "missingSkills": missing_skills,
        "weakSkills": weak_skills,
        "strongSkills": strong_skills,
        "totalGaps": len([s for s in skills if s["gap"] > 0]),
        "totalMet": len(strong_skills),
    }
