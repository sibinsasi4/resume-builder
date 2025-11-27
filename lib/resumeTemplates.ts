import { ResumeData } from './types';

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    color: string;
    data: ResumeData;
}

export const resumeTemplates: ResumeTemplate[] = [
    {
        id: 'software-developer',
        name: 'Software Developer',
        description: 'Perfect for software engineers and developers',
        category: 'Technology',
        color: 'blue',
        data: {
            personalInfo: {
                fullName: 'Alex Johnson',
                email: 'alex.johnson@email.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
                linkedin: 'linkedin.com/in/alexjohnson',
                github: 'github.com/alexjohnson',
                website: 'alexjohnson.dev',
            },
            summary: 'Passionate Full Stack Developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of delivering high-quality software solutions and leading development teams.',
            experience: [
                {
                    id: '1',
                    company: 'Tech Innovations Inc.',
                    position: 'Senior Software Engineer',
                    location: 'San Francisco, CA',
                    startDate: '2021-03',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Led development of microservices architecture serving 1M+ users',
                        'Reduced API response time by 40% through optimization',
                        'Mentored team of 5 junior developers',
                        'Implemented CI/CD pipeline reducing deployment time by 60%'
                    ]
                },
                {
                    id: '2',
                    company: 'StartupXYZ',
                    position: 'Full Stack Developer',
                    location: 'San Francisco, CA',
                    startDate: '2019-01',
                    endDate: '2021-02',
                    current: false,
                    description: [
                        'Built real-time collaboration features using WebSockets',
                        'Developed RESTful APIs handling 10K+ requests/day',
                        'Integrated payment systems (Stripe, PayPal)',
                        'Improved application performance by 35%'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'University of California, Berkeley',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    location: 'Berkeley, CA',
                    startDate: '2015',
                    endDate: '2019',
                    gpa: '3.8/4.0',
                    achievements: ['Dean\'s List', 'CS Department Honors']
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Languages',
                    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL']
                },
                {
                    id: '2',
                    category: 'Frontend',
                    items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Redux']
                },
                {
                    id: '3',
                    category: 'Backend',
                    items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis']
                },
                {
                    id: '4',
                    category: 'DevOps',
                    items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git']
                }
            ],
            projects: [
                {
                    id: '1',
                    name: 'E-Commerce Platform',
                    description: 'Built full-stack e-commerce platform with payment integration and real-time inventory management',
                    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
                    link: 'github.com/alexjohnson/ecommerce'
                },
                {
                    id: '2',
                    name: 'Task Management App',
                    description: 'Developed collaborative task management tool with real-time updates and team features',
                    technologies: ['Next.js', 'WebSockets', 'MongoDB'],
                    link: 'taskmaster.app'
                }
            ],
            certifications: [
                {
                    id: '1',
                    name: 'AWS Certified Solutions Architect',
                    issuer: 'Amazon Web Services',
                    date: '2022-06',
                    credentialId: 'AWS-12345'
                }
            ],
            achievements: [
                'Led team that won company hackathon 2022',
                'Open source contributor with 500+ GitHub stars',
                'Speaker at ReactConf 2023'
            ]
        }
    },
    {
        id: 'marketing-professional',
        name: 'Marketing Professional',
        description: 'Ideal for marketing managers and digital marketers',
        category: 'Marketing',
        color: 'purple',
        data: {
            personalInfo: {
                fullName: 'Sarah Martinez',
                email: 'sarah.martinez@email.com',
                phone: '+1 (555) 987-6543',
                location: 'New York, NY',
                linkedin: 'linkedin.com/in/sarahmartinez',
                website: 'sarahmarketingpro.com',
            },
            summary: 'Results-driven Marketing Manager with 7+ years of experience in digital marketing, brand strategy, and campaign management. Proven ability to increase brand awareness, drive customer engagement, and deliver ROI-focused marketing initiatives.',
            experience: [
                {
                    id: '1',
                    company: 'Global Brands Co.',
                    position: 'Senior Marketing Manager',
                    location: 'New York, NY',
                    startDate: '2020-06',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Managed $2M annual marketing budget across digital channels',
                        'Increased brand awareness by 150% through integrated campaigns',
                        'Led team of 8 marketing professionals',
                        'Achieved 45% growth in social media engagement'
                    ]
                },
                {
                    id: '2',
                    company: 'Creative Agency Inc.',
                    position: 'Digital Marketing Specialist',
                    location: 'New York, NY',
                    startDate: '2017-03',
                    endDate: '2020-05',
                    current: false,
                    description: [
                        'Developed and executed SEO strategies improving organic traffic by 200%',
                        'Managed PPC campaigns with average ROI of 350%',
                        'Created content marketing strategy generating 50K+ monthly visitors',
                        'Implemented marketing automation increasing lead conversion by 60%'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'New York University',
                    degree: 'Master of Business Administration',
                    field: 'Marketing',
                    location: 'New York, NY',
                    startDate: '2015',
                    endDate: '2017',
                    gpa: '3.9/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Digital Marketing',
                    items: ['SEO/SEM', 'Google Analytics', 'PPC', 'Email Marketing', 'Content Marketing']
                },
                {
                    id: '2',
                    category: 'Social Media',
                    items: ['Facebook Ads', 'Instagram Marketing', 'LinkedIn Ads', 'Twitter', 'TikTok']
                },
                {
                    id: '3',
                    category: 'Tools',
                    items: ['HubSpot', 'Salesforce', 'Mailchimp', 'Hootsuite', 'Canva']
                },
                {
                    id: '4',
                    category: 'Strategy',
                    items: ['Brand Management', 'Campaign Planning', 'Market Research', 'Analytics']
                }
            ],
            projects: [],
            certifications: [
                {
                    id: '1',
                    name: 'Google Analytics Certified',
                    issuer: 'Google',
                    date: '2022-01'
                },
                {
                    id: '2',
                    name: 'HubSpot Inbound Marketing',
                    issuer: 'HubSpot Academy',
                    date: '2021-08'
                }
            ],
            achievements: [
                'Awarded "Marketer of the Year" 2022',
                'Increased company revenue by $5M through marketing initiatives',
                'Featured in Marketing Week magazine'
            ]
        }
    },
    {
        id: 'business-analyst',
        name: 'Business Analyst',
        description: 'Great for business analysts and data professionals',
        category: 'Business',
        color: 'green',
        data: {
            personalInfo: {
                fullName: 'Michael Chen',
                email: 'michael.chen@email.com',
                phone: '+1 (555) 456-7890',
                location: 'Chicago, IL',
                linkedin: 'linkedin.com/in/michaelchen',
            },
            summary: 'Detail-oriented Business Analyst with 6+ years of experience in data analysis, process improvement, and stakeholder management. Skilled in translating business requirements into technical solutions and driving data-driven decision making.',
            experience: [
                {
                    id: '1',
                    company: 'Fortune 500 Corp',
                    position: 'Senior Business Analyst',
                    location: 'Chicago, IL',
                    startDate: '2021-01',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Led requirements gathering for $10M ERP implementation',
                        'Improved operational efficiency by 30% through process optimization',
                        'Created data dashboards reducing reporting time by 50%',
                        'Facilitated workshops with C-level stakeholders'
                    ]
                },
                {
                    id: '2',
                    company: 'Consulting Group LLC',
                    position: 'Business Analyst',
                    location: 'Chicago, IL',
                    startDate: '2018-06',
                    endDate: '2020-12',
                    current: false,
                    description: [
                        'Analyzed business processes for 15+ client projects',
                        'Developed SQL queries for data extraction and analysis',
                        'Created detailed documentation and user stories',
                        'Reduced project delivery time by 25% through agile methodologies'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'Northwestern University',
                    degree: 'Bachelor of Science',
                    field: 'Business Administration',
                    location: 'Evanston, IL',
                    startDate: '2014',
                    endDate: '2018',
                    gpa: '3.7/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Analysis',
                    items: ['Requirements Gathering', 'Process Mapping', 'Gap Analysis', 'SWOT Analysis']
                },
                {
                    id: '2',
                    category: 'Technical',
                    items: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Python']
                },
                {
                    id: '3',
                    category: 'Methodologies',
                    items: ['Agile/Scrum', 'Waterfall', 'Six Sigma', 'Lean']
                },
                {
                    id: '4',
                    category: 'Tools',
                    items: ['JIRA', 'Confluence', 'Visio', 'MS Project', 'Salesforce']
                }
            ],
            projects: [],
            certifications: [
                {
                    id: '1',
                    name: 'Certified Business Analysis Professional (CBAP)',
                    issuer: 'IIBA',
                    date: '2021-09'
                },
                {
                    id: '2',
                    name: 'Scrum Master Certified',
                    issuer: 'Scrum Alliance',
                    date: '2020-03'
                }
            ],
            achievements: [
                'Saved company $2M through process improvements',
                'Led successful digital transformation project',
                'Mentored 10+ junior analysts'
            ]
        }
    },
    {
        id: 'creative-designer',
        name: 'Creative Designer',
        description: 'Perfect for UI/UX designers and creative professionals',
        category: 'Design',
        color: 'pink',
        data: {
            personalInfo: {
                fullName: 'Emma Williams',
                email: 'emma.williams@email.com',
                phone: '+1 (555) 234-5678',
                location: 'Los Angeles, CA',
                linkedin: 'linkedin.com/in/emmawilliams',
                website: 'emmawilliams.design',
                portfolio: 'behance.net/emmawilliams'
            },
            summary: 'Creative UI/UX Designer with 5+ years of experience crafting beautiful, user-centered digital experiences. Passionate about combining aesthetics with functionality to create intuitive interfaces that users love.',
            experience: [
                {
                    id: '1',
                    company: 'Design Studio Pro',
                    position: 'Senior UI/UX Designer',
                    location: 'Los Angeles, CA',
                    startDate: '2021-04',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Designed user interfaces for 20+ mobile and web applications',
                        'Led design system creation used across 50+ products',
                        'Increased user satisfaction scores by 45% through UX improvements',
                        'Collaborated with development teams in agile environment'
                    ]
                },
                {
                    id: '2',
                    company: 'Creative Agency',
                    position: 'UI/UX Designer',
                    location: 'Los Angeles, CA',
                    startDate: '2019-02',
                    endDate: '2021-03',
                    current: false,
                    description: [
                        'Created wireframes, prototypes, and high-fidelity mockups',
                        'Conducted user research and usability testing',
                        'Designed responsive websites for Fortune 500 clients',
                        'Improved conversion rates by 60% through A/B testing'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'Art Center College of Design',
                    degree: 'Bachelor of Fine Arts',
                    field: 'Graphic Design',
                    location: 'Pasadena, CA',
                    startDate: '2015',
                    endDate: '2019',
                    gpa: '3.9/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Design Tools',
                    items: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator']
                },
                {
                    id: '2',
                    category: 'Prototyping',
                    items: ['InVision', 'Framer', 'Principle', 'After Effects']
                },
                {
                    id: '3',
                    category: 'Skills',
                    items: ['UI Design', 'UX Research', 'Wireframing', 'User Testing', 'Design Systems']
                },
                {
                    id: '4',
                    category: 'Development',
                    items: ['HTML', 'CSS', 'Basic JavaScript', 'Responsive Design']
                }
            ],
            projects: [
                {
                    id: '1',
                    name: 'E-Commerce Redesign',
                    description: 'Complete redesign of e-commerce platform increasing conversion by 75%',
                    technologies: ['Figma', 'User Research', 'A/B Testing'],
                    link: 'behance.net/gallery/ecommerce'
                },
                {
                    id: '2',
                    name: 'Mobile Banking App',
                    description: 'Designed intuitive mobile banking experience for 100K+ users',
                    technologies: ['Sketch', 'Prototyping', 'iOS/Android'],
                    link: 'behance.net/gallery/banking-app'
                }
            ],
            certifications: [
                {
                    id: '1',
                    name: 'Google UX Design Certificate',
                    issuer: 'Google',
                    date: '2021-05'
                }
            ],
            achievements: [
                'Won Awwwards Site of the Day',
                'Featured in Design Milk magazine',
                'Portfolio viewed 50K+ times on Behance'
            ]
        }
    },
    {
        id: 'sales-executive',
        name: 'Sales Executive',
        description: 'Ideal for sales professionals and account managers',
        category: 'Sales',
        color: 'orange',
        data: {
            personalInfo: {
                fullName: 'David Thompson',
                email: 'david.thompson@email.com',
                phone: '+1 (555) 345-6789',
                location: 'Dallas, TX',
                linkedin: 'linkedin.com/in/davidthompson',
            },
            summary: 'Dynamic Sales Executive with 8+ years of experience exceeding sales targets and building lasting client relationships. Proven track record of driving revenue growth, closing high-value deals, and leading successful sales teams.',
            experience: [
                {
                    id: '1',
                    company: 'Enterprise Solutions Inc.',
                    position: 'Senior Sales Executive',
                    location: 'Dallas, TX',
                    startDate: '2020-01',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Exceeded annual sales quota by 180% for 3 consecutive years',
                        'Generated $15M in new business revenue',
                        'Managed portfolio of 50+ enterprise clients',
                        'Led sales team of 6 achieving 150% of team target'
                    ]
                },
                {
                    id: '2',
                    company: 'Tech Sales Corp',
                    position: 'Account Executive',
                    location: 'Dallas, TX',
                    startDate: '2016-06',
                    endDate: '2019-12',
                    current: false,
                    description: [
                        'Closed deals worth $8M in total contract value',
                        'Maintained 95% client retention rate',
                        'Developed strategic partnerships with Fortune 500 companies',
                        'Consistently ranked top 5% of sales team'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'University of Texas at Austin',
                    degree: 'Bachelor of Business Administration',
                    field: 'Marketing',
                    location: 'Austin, TX',
                    startDate: '2012',
                    endDate: '2016',
                    gpa: '3.6/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Sales',
                    items: ['B2B Sales', 'Enterprise Sales', 'Consultative Selling', 'Negotiation', 'Closing']
                },
                {
                    id: '2',
                    category: 'CRM & Tools',
                    items: ['Salesforce', 'HubSpot', 'LinkedIn Sales Navigator', 'ZoomInfo']
                },
                {
                    id: '3',
                    category: 'Skills',
                    items: ['Lead Generation', 'Pipeline Management', 'Account Management', 'Presentations']
                },
                {
                    id: '4',
                    category: 'Industry Knowledge',
                    items: ['SaaS', 'Cloud Solutions', 'Enterprise Software', 'Technology']
                }
            ],
            projects: [],
            certifications: [
                {
                    id: '1',
                    name: 'Salesforce Certified Administrator',
                    issuer: 'Salesforce',
                    date: '2021-03'
                },
                {
                    id: '2',
                    name: 'Challenger Sales Methodology',
                    issuer: 'Challenger',
                    date: '2020-07'
                }
            ],
            achievements: [
                'President\'s Club Winner 2021, 2022, 2023',
                'Closed largest deal in company history ($3M)',
                'Mentored 15+ sales representatives'
            ]
        }
    }
];
