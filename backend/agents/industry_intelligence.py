"""
Agent 2 — Industry Intelligence Agent
Returns current industry requirements for a target role.
"""
from data.knowledge_base import JOB_REQUIREMENTS


def run(target_role: str) -> dict:
    requirements = JOB_REQUIREMENTS.get(target_role, JOB_REQUIREMENTS["Data Analyst"])
    return {
        "targetRole": target_role,
        "requirements": requirements,
        "availableRoles": list(JOB_REQUIREMENTS.keys()),
    }
