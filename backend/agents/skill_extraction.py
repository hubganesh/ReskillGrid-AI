"""
Agent 1 — Skill Extraction Agent
Reads student inputs and produces a structured skill profile.
"""
from __future__ import annotations
from typing import Any
from data.knowledge_base import JOB_REQUIREMENTS, KEYWORD_SKILL_MAP


def compute_priority(gap: int, required_level: int) -> str:
    score = gap * required_level
    if score >= 12:
        return "Critical"
    if score >= 8:
        return "High"
    if score >= 4:
        return "Medium"
    return "Low"


def evidence_label(current_level: int) -> str:
    if current_level == 0:
        return "None"
    if current_level <= 2:
        return "Needs project"
    if current_level <= 3:
        return "Basic evidence"
    return "Moderate evidence"


def run(
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
    """Extract skills and build a structured profile."""
    requirements = JOB_REQUIREMENTS.get(target_role, JOB_REQUIREMENTS["Data Analyst"])

    # Build skill map from manual entries
    skill_map: dict[str, dict[str, Any]] = {}
    for s in manual_skills:
        if s.get("name"):
            skill_map[s["name"]] = {"level": int(s.get("level", 3)), "category": s.get("category", "Technical")}

    # Keyword detection from resume + projects
    combined_text = " ".join([resume_text] + academics + projects + certifications).lower()
    for keyword, (skill_name, default_level, category) in KEYWORD_SKILL_MAP.items():
        if keyword in combined_text and skill_name not in skill_map:
            skill_map[skill_name] = {"level": default_level, "category": category}

    # Build skill grid vs requirements
    skills: list[dict[str, Any]] = []
    for req in requirements:
        skill_name = req["skill"]
        current_info = skill_map.get(skill_name, {"level": 0, "category": req["category"]})
        current_level = current_info["level"]
        gap = max(0, req["level"] - current_level)
        skills.append({
            "name": skill_name,
            "currentLevel": current_level,
            "requiredLevel": req["level"],
            "gap": gap,
            "priority": compute_priority(gap, req["level"]),
            "evidence": evidence_label(current_level),
            "category": req["category"],
        })

    return {
        "name": name,
        "degree": degree,
        "college": college,
        "targetRole": target_role,
        "skills": skills,
        "projectCount": len(projects),
        "certificationCount": len(certifications),
    }
