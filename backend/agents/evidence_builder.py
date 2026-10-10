"""
Agent 5 — Evidence Builder Agent
Recommends projects, assessments, and portfolio evidence for each gap skill.
"""
from data.knowledge_base import EVIDENCE_TEMPLATES


def run(skills: list[dict]) -> list[dict]:
    gap_skills = [s for s in skills if s["gap"] > 0]
    tasks = []
    for skill in gap_skills[:5]:
        name = skill["name"]
        template = EVIDENCE_TEMPLATES.get(name, {
            "project": f"{name} Practical Project",
            "description": f"Build a hands-on project demonstrating {name} proficiency through a real-world use case.",
            "deliverables": ["Working project", "Documentation", "GitHub repository", "Presentation/demo"],
            "days": 7,
        })
        tasks.append({
            "skill": name,
            "priority": skill["priority"],
            "project": template["project"],
            "description": template["description"],
            "deliverables": template["deliverables"],
            "estimatedDays": template["days"],
            "status": "pending",
        })
    return tasks
