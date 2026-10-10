"""
ReskillGrid AI — Job requirements knowledge base
Curated from multiple real job postings, normalized to a 1–5 scale.
"""

JOB_REQUIREMENTS = {
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

EVIDENCE_TEMPLATES = {
    "SQL": {
        "project": "E-commerce Customer Analytics Database",
        "description": "Build a relational database for an e-commerce platform, write 20+ analytical queries, and extract business insights.",
        "deliverables": ["Normalized database schema (ERD)", "20+ SQL queries", "Insights report", "GitHub repository"],
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
        "deliverables": ["Statistical analysis notebook", "Visualizations", "Written findings report", "Slide presentation"],
        "days": 6,
    },
    "Data Visualization": {
        "project": "Storytelling with Data Portfolio",
        "description": "Create a portfolio with 3 distinct dashboards or charts, each communicating a clear business insight.",
        "deliverables": ["3 visualization artifacts", "Narrative for each", "Tool: Python/Power BI/Tableau", "GitHub/portfolio link"],
        "days": 7,
    },
    "Communication": {
        "project": "Data Presentation & Storytelling Assessment",
        "description": "Record a 10-minute presentation explaining a technical analysis to a non-technical audience.",
        "deliverables": ["Recorded presentation (10 min)", "Slide deck", "Written executive summary", "Self-review notes"],
        "days": 4,
    },
    "Excel": {
        "project": "Advanced Excel Financial Dashboard",
        "description": "Build an Excel dashboard with pivot tables, advanced formulas (VLOOKUP, INDEX-MATCH), and dynamic charts.",
        "deliverables": ["Excel workbook with formulas", "Pivot table analysis", "Dynamic charts", "Screenshot walkthrough"],
        "days": 4,
    },
}

KEYWORD_SKILL_MAP = {
    "python": ("Python", 3, "Technical"),
    "sql": ("SQL", 2, "Technical"),
    "power bi": ("Power BI", 1, "Tools"),
    "powerbi": ("Power BI", 1, "Tools"),
    "excel": ("Excel", 3, "Tools"),
    "machine learning": ("Machine Learning", 2, "Domain"),
    "statistics": ("Statistics", 3, "Domain"),
    "javascript": ("JavaScript", 2, "Technical"),
    "react": ("React", 2, "Technical"),
    "git": ("Git", 3, "Tools"),
    "communication": ("Communication", 2, "Soft Skills"),
    "data visualization": ("Data Visualization", 2, "Technical"),
    "node.js": ("Node.js", 2, "Technical"),
    "nodejs": ("Node.js", 2, "Technical"),
    "css": ("CSS", 2, "Technical"),
    "rest api": ("REST APIs", 2, "Technical"),
    "problem solving": ("Problem Solving", 3, "Soft Skills"),
}
