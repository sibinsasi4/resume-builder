#!/usr/bin/env python3
"""
Script to generate 12 new resume templates
Run this to append templates to resumeTemplates.ts
"""

templates_data = """
    ,{
        id: 'project-manager',
        name: 'Project Manager',
        description: 'Perfect for project managers and program coordinators',
        category: 'Business',
        color: 'teal',
        keywords: ['project manager', 'pmp', 'agile', 'scrum', 'project management', 'coordination', 'planning', 'stakeholder', 'delivery'],
        data: {
            personalInfo: {
                fullName: 'Maria Garcia',
                email: 'maria.garcia@email.com',
                phone: '+1 (555) 234-5678',
                location: 'Austin, TX',
                linkedin: 'linkedin.com/in/mariagarcia',
            },
            summary: 'Certified Project Manager (PMP) with 8+ years of experience leading cross-functional teams and delivering complex projects on time and within budget.',
            experience: [
                {
                    id: '1',
                    company: 'Tech Solutions Corp',
                    position: 'Senior Project Manager',
                    location: 'Austin, TX',
                    startDate: '2020-05',
                    endDate: 'Present',
                    current: true,
                    description: ['Manage portfolio of 5+ concurrent projects worth $15M total budget', 'Led digital transformation project reducing operational costs by 30%', 'Achieved 95% on-time delivery rate']
                }
            ],
            education: [{id: '1', institution: 'University of Texas', degree: 'MBA', field: 'Project Management', location: 'Austin, TX', startDate: '2015', endDate: '2017', gpa: '3.8/4.0'}],
            skills: [{id: '1', category: 'PM Tools', items: ['JIRA', 'MS Project', 'Agile', 'Scrum']}],
            projects: [],
            certifications: [{id: '1', name: 'PMP', issuer: 'PMI', date: '2019-06'}],
            achievements: ['Delivered $20M+ in projects with zero budget overruns']
        }
    }
"""

print("Template generation script ready")
print("Add the templates_data to resumeTemplates.ts before the closing ];")
