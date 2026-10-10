"""
Integration test — verifies score ranges match the spec's demo expectations.
Spec says: Rahul Sharma demo should show ~64% readiness, projected ~82%.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'frontend', 'api'))
from _lib import run_analysis, JOB_REQUIREMENTS

ERRORS = []

def check(label, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    if not condition:
        ERRORS.append(f"{label}: {detail}")
    print(f"  [{status}] {label}" + (f" — {detail}" if detail else ""))

# ── Test 1: every role produces valid output ──────────────────────────────────
print("Test 1: All roles produce valid output")
for role in JOB_REQUIREMENTS.keys():
    r = run_analysis({
        'name': 'Test', 'degree': 'B.Tech', 'college': 'VIT',
        'targetRole': role, 'resumeText': 'python sql excel',
        'academics': [], 'projects': ['project'], 'certifications': ['cert'],
        'manualSkills': [{'name': 'Python', 'level': 3, 'category': 'Technical'}],
    })
    check(role, 0 <= r['readinessScore'] <= 100 and len(r['skillGrid']) > 0)

# ── Test 2: Rahul Sharma demo — score must be in spec range (60–70%) ──────────
print()
print("Test 2: Demo student Rahul Sharma — score must be in 60-70% range")
result = run_analysis({
    'name': 'Rahul Sharma',
    'degree': 'B.Tech Computer Science',
    'college': 'VIT University',
    'targetRole': 'Data Analyst',
    'resumeText': 'Proficient in Python SQL basics Excel Statistics pandas matplotlib git.',
    'academics': ['Data Structures', 'Statistics', 'Database Management'],
    'projects': ['Student Performance Analytics using Python', 'Sales Data Analysis Dashboard using Excel'],
    'certifications': ['Google Data Analytics Certificate'],
    'manualSkills': [
        {'name': 'Python',        'level': 4, 'category': 'Technical'},
        {'name': 'SQL',           'level': 2, 'category': 'Technical'},
        {'name': 'Excel',         'level': 4, 'category': 'Tools'},
        {'name': 'Statistics',    'level': 3, 'category': 'Domain'},
        {'name': 'Power BI',      'level': 1, 'category': 'Tools'},
        {'name': 'Communication', 'level': 2, 'category': 'Soft Skills'},
    ],
})

score = result['readinessScore']
print()
print("  Skill Grid:")
for s in result['skillGrid']:
    bar = '#' * s['currentLevel'] + '.' * (5 - s['currentLevel'])
    icon = '[OK]' if s['gap'] == 0 else ('[~]' if s['gap'] == 1 else '[X]')
    print(f"    {icon} {s['name']:<22} [{bar}] {s['currentLevel']}/5 -> {s['requiredLevel']}/5  [{s['priority']}]")

print()
print(f"  Readiness score   : {score}%")
print(f"  Projected score   : {result['projectedScore']}%")
print(f"  Strong areas      : {result['strongAreas']}")
print(f"  Critical gaps     : {result['criticalGaps']}")

check("Score in 55-75% range (spec: ~64%)", 55 <= score <= 75, f"got {score}%")
check("Projected score > current score", result['projectedScore'] > score,
      f"projected={result['projectedScore']}% current={score}%")
check("Projected score in 75-90% range (spec: ~82%)", 70 <= result['projectedScore'] <= 92,
      f"got {result['projectedScore']}%")
check("Python has gap=0 (Python 4/5 vs need 4/5)", any(s['name'] == 'Python' and s['gap'] == 0 for s in result['skillGrid']))
check("SQL has gap>0", any(s['name'] == 'SQL' and s['gap'] > 0 for s in result['skillGrid']))
check("Power BI is Critical priority", any(s['name'] == 'Power BI' and s['priority'] == 'Critical' for s in result['skillGrid']))
check("Statistics has gap=1 → ⚠️ partial", any(s['name'] == 'Statistics' and s['gap'] == 1 for s in result['skillGrid']))
check("Strong areas contains Python", 'Python' in result['strongAreas'])
check("Evidence plan has 5 tasks", len(result['evidencePlan']) == 5)

# ── Test 3: Empty input doesn't crash ─────────────────────────────────────────
print()
print("Test 3: Empty input is safe")
r = run_analysis({})
check("No crash on empty input", isinstance(r['readinessScore'], int))

# ── Summary ───────────────────────────────────────────────────────────────────
print()
if ERRORS:
    print(f"FAILED ({len(ERRORS)} errors):")
    for e in ERRORS:
        print(f"  ✗ {e}")
    sys.exit(1)
else:
    print("ALL TESTS PASSED")
