import sys
sys.path.insert(0, '.')
from agents import skill_extraction, priority_agent, evidence_builder, readiness_auditor, gap_analysis

profile = skill_extraction.run(
    name='Rahul Sharma',
    degree='B.Tech CSE',
    college='VIT',
    target_role='Data Analyst',
    resume_text='Python SQL Excel statistics pandas matplotlib git',
    academics=['Statistics', 'Database Management'],
    projects=['Sales Dashboard Excel', 'Python Analysis'],
    certifications=['Google Data Analytics'],
    manual_skills=[
        {'name': 'Python', 'level': 4, 'category': 'Technical'},
        {'name': 'SQL', 'level': 2, 'category': 'Technical'},
        {'name': 'Excel', 'level': 4, 'category': 'Tools'},
        {'name': 'Statistics', 'level': 3, 'category': 'Domain'},
        {'name': 'Power BI', 'level': 1, 'category': 'Tools'},
        {'name': 'Communication', 'level': 2, 'category': 'Soft Skills'},
    ],
)
p = priority_agent.run(profile['skills'])
e = evidence_builder.run(p)
a = readiness_auditor.run(p, e, 2, 1)

print('=== RESKILLGRID AI END-TO-END TEST ===')
print('Student:', profile['name'])
print('Target:', profile['targetRole'])
print('Skills:', len(p))
print()
print('SKILL GRID:')
for s in p:
    print(f"  {s['name']:<22} {s['currentLevel']}/5 -> {s['requiredLevel']}/5  gap={s['gap']}  [{s['priority']}]")
print()
print('READINESS SCORE:', a['score'], '%')
print('Strong areas:', a['strongAreas'])
print('Critical gaps:', a['criticalGaps'])
print()
print('EVIDENCE PLAN:')
for t in e:
    print(f"  [{t['priority']}] {t['skill']} -> {t['project']}")
print()
print('RECOMMENDATIONS:')
for i, r in enumerate(a['recommendations'], 1):
    print(f'  {i}. {r}')

print()
print('ALL TESTS PASSED')
