"""
Agent 4 — Priority Agent
Ranks skill gaps by: Industry Demand × Skill Gap × Role Importance.
"""
PRIORITY_ORDER = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}


def run(skills: list[dict]) -> list[dict]:
    return sorted(
        skills,
        key=lambda s: (PRIORITY_ORDER.get(s["priority"], 0), s["gap"]),
        reverse=True,
    )
