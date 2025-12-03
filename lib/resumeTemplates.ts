import { ResumeData } from './types';

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    color: string;
    keywords: string[]; // For search functionality
    data: ResumeData;
}

export const resumeTemplates: ResumeTemplate[] = [
    {
        id: 'software-developer',
        name: 'Software Developer',
        description: 'Perfect for software engineers and developers',
        category: 'Technology',
        color: 'blue',
        keywords: ['software', 'developer', 'engineer', 'programming', 'coding', 'full stack', 'web development', 'react', 'node', 'javascript', 'typescript', 'tech', 'technology', 'frontend', 'backend'],
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
        keywords: ['marketing', 'digital marketing', 'social media', 'seo', 'content', 'campaigns', 'brand', 'advertising', 'analytics', 'email marketing', 'ppc'],
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
        keywords: ['business analyst', 'data analysis', 'requirements', 'process improvement', 'sql', 'agile', 'scrum', 'analytics', 'business', 'data', 'reporting'],
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
        keywords: ['designer', 'ui', 'ux', 'creative', 'graphic design', 'figma', 'adobe', 'visual design', 'user experience', 'web design', 'prototyping'],
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
        keywords: ['sales', 'account executive', 'business development', 'b2b', 'revenue', 'crm', 'salesforce', 'negotiation', 'closing', 'account management'],
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
    },
    {
        id: 'operations-manager',
        name: 'Operations Manager',
        description: 'Perfect for operations and process management professionals',
        category: 'Business',
        color: 'slate',
        keywords: ['operations', 'process optimization', 'supply chain', 'logistics', 'lean six sigma', 'management', 'efficiency', 'warehouse', 'operations manager'],
        data: {
            personalInfo: {
                fullName: 'Jennifer Rodriguez',
                email: 'jennifer.rodriguez@email.com',
                phone: '+1 (555) 678-9012',
                location: 'Atlanta, GA',
                linkedin: 'linkedin.com/in/jenniferrodriguez',
            },
            summary: 'Strategic Operations Manager with 9+ years of experience optimizing business processes, reducing costs, and improving operational efficiency. Expert in supply chain management, team leadership, and implementing data-driven solutions that drive measurable results.',
            experience: [
                {
                    id: '1',
                    company: 'Global Manufacturing Corp',
                    position: 'Senior Operations Manager',
                    location: 'Atlanta, GA',
                    startDate: '2020-03',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Manage operations for 3 facilities with 200+ employees and $50M annual budget',
                        'Reduced operational costs by 25% through process optimization and automation',
                        'Improved on-time delivery rate from 82% to 97% within 18 months',
                        'Led cross-functional teams to implement Lean Six Sigma methodologies',
                        'Achieved 99.2% quality compliance rate exceeding industry standards'
                    ]
                },
                {
                    id: '2',
                    company: 'Supply Chain Solutions Inc.',
                    position: 'Operations Manager',
                    location: 'Atlanta, GA',
                    startDate: '2017-06',
                    endDate: '2020-02',
                    current: false,
                    description: [
                        'Managed daily operations for distribution center processing 10K+ orders daily',
                        'Implemented WMS system reducing order processing time by 40%',
                        'Reduced inventory carrying costs by 30% through demand forecasting',
                        'Led team of 50 warehouse staff and 5 supervisors',
                        'Achieved 15% improvement in warehouse productivity metrics'
                    ]
                },
                {
                    id: '3',
                    company: 'Logistics Partners LLC',
                    position: 'Operations Coordinator',
                    location: 'Atlanta, GA',
                    startDate: '2015-01',
                    endDate: '2017-05',
                    current: false,
                    description: [
                        'Coordinated logistics operations for regional distribution network',
                        'Streamlined shipping processes reducing transit time by 20%',
                        'Managed vendor relationships and negotiated contracts saving $500K annually',
                        'Created operational dashboards for real-time performance monitoring'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'Georgia Institute of Technology',
                    degree: 'Master of Science',
                    field: 'Industrial Engineering',
                    location: 'Atlanta, GA',
                    startDate: '2013',
                    endDate: '2015',
                    gpa: '3.8/4.0'
                },
                {
                    id: '2',
                    institution: 'University of Georgia',
                    degree: 'Bachelor of Business Administration',
                    field: 'Operations Management',
                    location: 'Athens, GA',
                    startDate: '2009',
                    endDate: '2013',
                    gpa: '3.7/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Operations',
                    items: ['Process Optimization', 'Supply Chain Management', 'Inventory Control', 'Quality Assurance', 'Logistics']
                },
                {
                    id: '2',
                    category: 'Methodologies',
                    items: ['Lean Six Sigma', 'Kaizen', 'Continuous Improvement', 'Root Cause Analysis', 'KPI Management']
                },
                {
                    id: '3',
                    category: 'Technical',
                    items: ['SAP', 'Oracle ERP', 'WMS', 'Excel', 'Power BI', 'SQL']
                },
                {
                    id: '4',
                    category: 'Leadership',
                    items: ['Team Management', 'Change Management', 'Vendor Management', 'Budget Planning', 'Strategic Planning']
                }
            ],
            projects: [
                {
                    id: '1',
                    name: 'Warehouse Automation Project',
                    description: 'Led $2M automation initiative implementing robotics and AI, increasing throughput by 60%',
                    technologies: ['Automation', 'Robotics', 'AI', 'Project Management']
                },
                {
                    id: '2',
                    name: 'Supply Chain Digital Transformation',
                    description: 'Spearheaded digital transformation reducing supply chain costs by $3M annually',
                    technologies: ['SAP', 'IoT', 'Analytics', 'Cloud Solutions']
                }
            ],
            certifications: [
                {
                    id: '1',
                    name: 'Lean Six Sigma Black Belt',
                    issuer: 'ASQ',
                    date: '2019-08'
                },
                {
                    id: '2',
                    name: 'Certified Supply Chain Professional (CSCP)',
                    issuer: 'APICS',
                    date: '2018-05'
                },
                {
                    id: '3',
                    name: 'Project Management Professional (PMP)',
                    issuer: 'PMI',
                    date: '2020-11'
                }
            ],
            achievements: [
                'Saved company $5M through operational improvements',
                'Awarded "Operations Excellence Award" 2022',
                'Led team that achieved ISO 9001 certification',
                'Reduced workplace incidents by 75% through safety initiatives'
            ]
        }
    },
    {
        id: 'product-manager',
        name: 'Product Manager',
        description: 'Ideal for product managers and product strategists',
        category: 'Technology',
        color: 'indigo',
        keywords: ['product manager', 'product strategy', 'roadmap', 'agile', 'user research', 'saas', 'product development', 'analytics', 'pm', 'product owner'],
        data: {
            personalInfo: {
                fullName: 'Ryan Patel',
                email: 'ryan.patel@email.com',
                phone: '+1 (555) 890-1234',
                location: 'Seattle, WA',
                linkedin: 'linkedin.com/in/ryanpatel',
                website: 'ryanpatel.pm',
            },
            summary: 'Innovative Product Manager with 7+ years of experience leading product strategy, roadmap planning, and cross-functional teams. Proven track record of launching successful products that drive user growth, engagement, and revenue. Expert in agile methodologies, data analytics, and customer-centric product development.',
            experience: [
                {
                    id: '1',
                    company: 'TechVision Inc.',
                    position: 'Senior Product Manager',
                    location: 'Seattle, WA',
                    startDate: '2021-02',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Lead product strategy for SaaS platform serving 500K+ users generating $20M ARR',
                        'Launched 3 major product features increasing user engagement by 85%',
                        'Grew monthly active users from 200K to 500K in 2 years',
                        'Manage product roadmap and prioritize features using data-driven approach',
                        'Collaborate with engineering, design, and marketing teams of 30+ members',
                        'Achieved 4.8/5.0 App Store rating through continuous product improvements'
                    ]
                },
                {
                    id: '2',
                    company: 'StartupHub',
                    position: 'Product Manager',
                    location: 'Seattle, WA',
                    startDate: '2018-07',
                    endDate: '2021-01',
                    current: false,
                    description: [
                        'Owned product lifecycle from ideation to launch for mobile application',
                        'Conducted user research with 200+ customers to validate product-market fit',
                        'Increased conversion rate by 120% through A/B testing and optimization',
                        'Reduced customer churn by 35% by implementing user feedback loop',
                        'Managed $2M product development budget',
                        'Led successful Series A fundraising with product demos and metrics'
                    ]
                },
                {
                    id: '3',
                    company: 'Digital Solutions Co.',
                    position: 'Associate Product Manager',
                    location: 'San Francisco, CA',
                    startDate: '2017-01',
                    endDate: '2018-06',
                    current: false,
                    description: [
                        'Assisted in product planning and feature prioritization',
                        'Wrote detailed product requirements and user stories',
                        'Analyzed product metrics and created dashboards in Mixpanel',
                        'Coordinated product launches with cross-functional stakeholders'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'Stanford University',
                    degree: 'Master of Business Administration',
                    field: 'Product Management',
                    location: 'Stanford, CA',
                    startDate: '2015',
                    endDate: '2017',
                    gpa: '3.9/4.0'
                },
                {
                    id: '2',
                    institution: 'University of Washington',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    location: 'Seattle, WA',
                    startDate: '2011',
                    endDate: '2015',
                    gpa: '3.7/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Product Management',
                    items: ['Product Strategy', 'Roadmap Planning', 'Feature Prioritization', 'User Research', 'Product Analytics']
                },
                {
                    id: '2',
                    category: 'Methodologies',
                    items: ['Agile/Scrum', 'Design Thinking', 'Lean Startup', 'OKRs', 'A/B Testing']
                },
                {
                    id: '3',
                    category: 'Tools',
                    items: ['JIRA', 'Figma', 'Mixpanel', 'Google Analytics', 'Amplitude', 'ProductBoard']
                },
                {
                    id: '4',
                    category: 'Technical',
                    items: ['SQL', 'Python', 'API Design', 'Technical Documentation', 'Data Analysis']
                }
            ],
            projects: [
                {
                    id: '1',
                    name: 'AI-Powered Recommendation Engine',
                    description: 'Led development of ML-based recommendation system increasing user engagement by 90% and revenue by $5M',
                    technologies: ['Machine Learning', 'Python', 'A/B Testing', 'Analytics']
                },
                {
                    id: '2',
                    name: 'Mobile App Redesign',
                    description: 'Spearheaded complete mobile app redesign improving user retention by 65% and App Store rating to 4.8',
                    technologies: ['iOS', 'Android', 'UX Research', 'Prototyping']
                },
                {
                    id: '3',
                    name: 'Enterprise Dashboard Platform',
                    description: 'Launched B2B analytics dashboard generating $3M in new enterprise revenue',
                    technologies: ['SaaS', 'Enterprise', 'Data Visualization', 'APIs']
                }
            ],
            certifications: [
                {
                    id: '1',
                    name: 'Certified Scrum Product Owner (CSPO)',
                    issuer: 'Scrum Alliance',
                    date: '2020-04'
                },
                {
                    id: '2',
                    name: 'Product Management Certificate',
                    issuer: 'Product School',
                    date: '2019-09'
                },
                {
                    id: '3',
                    name: 'Google Analytics Certified',
                    issuer: 'Google',
                    date: '2021-02'
                }
            ],
            achievements: [
                'Launched product featured in TechCrunch and Product Hunt',
                'Led product that won "Best SaaS Product 2023" award',
                'Grew product from 0 to 500K users in 3 years',
                'Speaker at ProductCon 2023 on AI in Product Management'
            ]
        }
    },
    {
        id: 'project-manager',
        name: 'Project Manager',
        description: 'Perfect for project managers and program coordinators',
        category: 'Business',
        color: 'teal',
        keywords: ['project manager', 'pmp', 'agile', 'scrum', 'project management', 'coordination', 'planning', 'stakeholder', 'delivery', 'budget'],
        data: {
            personalInfo: {
                fullName: 'Maria Garcia',
                email: 'maria.garcia@email.com',
                phone: '+1 (555) 234-5678',
                location: 'Austin, TX',
                linkedin: 'linkedin.com/in/mariagarcia',
            },
            summary: 'Certified Project Manager (PMP) with 8+ years leading cross-functional teams and delivering complex projects on time and within budget. Expert in Agile/Scrum methodologies, risk management, and stakeholder communication.',
            experience: [
                {
                    id: '1',
                    company: 'Tech Solutions Corp',
                    position: 'Senior Project Manager',
                    location: 'Austin, TX',
                    startDate: '2020-05',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Manage portfolio of 5+ concurrent projects worth $15M total budget',
                        'Led digital transformation project reducing operational costs by 30%',
                        'Coordinate cross-functional teams of 20+ members across 3 time zones',
                        'Achieved 95% on-time delivery rate for all projects',
                        'Implemented Agile practices improving team velocity by 40%'
                    ]
                },
                {
                    id: '2',
                    company: 'Global Consulting Group',
                    position: 'Project Manager',
                    location: 'Austin, TX',
                    startDate: '2017-03',
                    endDate: '2020-04',
                    current: false,
                    description: [
                        'Delivered 15+ client projects with 98% customer satisfaction',
                        'Managed project budgets ranging from $500K to $5M',
                        'Reduced project delivery time by 25% through process optimization',
                        'Mentored 5 junior project coordinators'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'University of Texas',
                    degree: 'Master of Business Administration',
                    field: 'Project Management',
                    location: 'Austin, TX',
                    startDate: '2015',
                    endDate: '2017',
                    gpa: '3.8/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Project Management',
                    items: ['Agile/Scrum', 'Waterfall', 'Risk Management', 'Budget Planning', 'Resource Allocation']
                },
                {
                    id: '2',
                    category: 'Tools',
                    items: ['JIRA', 'MS Project', 'Asana', 'Trello', 'Confluence', 'Smartsheet']
                },
                {
                    id: '3',
                    category: 'Technical',
                    items: ['Gantt Charts', 'WBS', 'Critical Path', 'Earned Value Management']
                }
            ],
            projects: [],
            certifications: [
                {
                    id: '1',
                    name: 'Project Management Professional (PMP)',
                    issuer: 'PMI',
                    date: '2019-06'
                },
                {
                    id: '2',
                    name: 'Certified Scrum Master (CSM)',
                    issuer: 'Scrum Alliance',
                    date: '2018-11'
                }
            ],
            achievements: [
                'Delivered $20M+ in projects with zero budget overruns',
                'PMI Project of the Year Award 2022',
                'Improved team productivity by 45% through Agile adoption'
            ]
        }
    },
    {
        id: 'hr-manager',
        name: 'HR Manager',
        description: 'Ideal for human resources managers and talent acquisition leads',
        category: 'Business',
        color: 'pink',
        keywords: ['hr', 'human resources', 'recruitment', 'talent acquisition', 'employee relations', 'hr manager', 'hiring', 'onboarding', 'benefits'],
        data: {
            personalInfo: {
                fullName: 'Lisa Anderson',
                email: 'lisa.anderson@email.com',
                phone: '+1 (555) 345-6789',
                location: 'Boston, MA',
                linkedin: 'linkedin.com/in/lisaanderson',
            },
            summary: 'Strategic HR Manager with 10+ years driving talent acquisition, employee engagement, and organizational development. Expert in building high-performing teams and fostering positive workplace culture.',
            experience: [
                {
                    id: '1',
                    company: 'Fortune 500 Tech Company',
                    position: 'Senior HR Manager',
                    location: 'Boston, MA',
                    startDate: '2019-06',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Lead HR operations for 500+ employees across 3 locations',
                        'Reduced employee turnover by 35% through retention initiatives',
                        'Implemented new HRIS system saving 20 hours/week in admin time',
                        'Managed $2M annual HR budget and benefits programs',
                        'Conducted 100+ performance reviews and career development plans'
                    ]
                },
                {
                    id: '2',
                    company: 'Growth Startup Inc',
                    position: 'HR Manager',
                    location: 'Boston, MA',
                    startDate: '2015-03',
                    endDate: '2019-05',
                    current: false,
                    description: [
                        'Built HR department from ground up during company growth phase',
                        'Hired 100+ employees in 2 years supporting 300% company growth',
                        'Created comprehensive employee handbook and HR policies',
                        'Achieved 92% employee satisfaction score in annual surveys'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'Boston University',
                    degree: 'Master of Human Resources Management',
                    field: 'HR Management',
                    location: 'Boston, MA',
                    startDate: '2013',
                    endDate: '2015',
                    gpa: '3.9/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'HR Functions',
                    items: ['Recruitment', 'Onboarding', 'Performance Management', 'Employee Relations', 'Compensation']
                },
                {
                    id: '2',
                    category: 'Tools',
                    items: ['Workday', 'BambooHR', 'LinkedIn Recruiter', 'ATS Systems', 'HRIS']
                },
                {
                    id: '3',
                    category: 'Compliance',
                    items: ['FMLA', 'ADA', 'EEOC', 'Labor Laws', 'Benefits Administration']
                }
            ],
            projects: [],
            certifications: [
                {
                    id: '1',
                    name: 'SHRM Senior Certified Professional (SHRM-SCP)',
                    issuer: 'SHRM',
                    date: '2018-09'
                },
                {
                    id: '2',
                    name: 'Professional in Human Resources (PHR)',
                    issuer: 'HRCI',
                    date: '2016-05'
                }
            ],
            achievements: [
                'Reduced average hiring time from 45 to 21 days',
                'Increased employee retention rate by 35%',
                'HR Excellence Award 2022'
            ]
        }
    },
    {
        id: 'financial-analyst',
        name: 'Financial Analyst',
        description: 'Great for financial analysts and corporate finance professionals',
        category: 'Business',
        color: 'green',
        keywords: ['financial analyst', 'finance', 'financial modeling', 'forecasting', 'budgeting', 'excel', 'analysis', 'reporting', 'cfa'],
        data: {
            personalInfo: {
                fullName: 'James Wilson',
                email: 'james.wilson@email.com',
                phone: '+1 (555) 456-7890',
                location: 'New York, NY',
                linkedin: 'linkedin.com/in/jameswilson',
            },
            summary: 'Detail-oriented Financial Analyst with 6+ years of experience in financial modeling, forecasting, and strategic planning. CFA Level II candidate with proven track record of driving data-driven business decisions.',
            experience: [
                {
                    id: '1',
                    company: 'Investment Bank Corp',
                    position: 'Senior Financial Analyst',
                    location: 'New York, NY',
                    startDate: '2021-01',
                    endDate: 'Present',
                    current: true,
                    description: [
                        'Build complex financial models for M&A deals worth $500M+',
                        'Conduct valuation analysis using DCF and comparable companies methods',
                        'Present financial findings and recommendations to C-suite executives',
                        'Improved forecasting accuracy by 25% through enhanced modeling techniques',
                        'Analyze market trends and competitive landscape for strategic planning'
                    ]
                },
                {
                    id: '2',
                    company: 'Tech Startup',
                    position: 'Financial Analyst',
                    location: 'New York, NY',
                    startDate: '2018-06',
                    endDate: '2020-12',
                    current: false,
                    description: [
                        'Managed annual budgeting process for company with $50M revenue',
                        'Created financial dashboards reducing reporting time by 40%',
                        'Analyzed KPIs and provided strategic recommendations to leadership',
                        'Supported Series B fundraising with financial projections'
                    ]
                }
            ],
            education: [
                {
                    id: '1',
                    institution: 'NYU Stern School of Business',
                    degree: 'Bachelor of Science',
                    field: 'Finance',
                    location: 'New York, NY',
                    startDate: '2014',
                    endDate: '2018',
                    gpa: '3.8/4.0'
                }
            ],
            skills: [
                {
                    id: '1',
                    category: 'Analysis',
                    items: ['Financial Modeling', 'Valuation', 'Forecasting', 'Budgeting', 'Variance Analysis']
                },
                {
                    id: '2',
                    category: 'Tools',
                    items: ['Excel', 'Bloomberg Terminal', 'SQL', 'Tableau', 'Power BI']
                },
                {
                    id: '3',
                    category: 'Finance',
                    items: ['DCF', 'LBO', 'M&A', 'FP&A', 'Financial Reporting']
                }
            ],
            projects: [],
            certifications: [
                {
                    id: '1',
                    name: 'CFA Level II Candidate',
                    issuer: 'CFA Institute',
                    date: '2023'
                },
                {
                    id: '2',
                    name: 'Financial Modeling & Valuation Analyst',
                    issuer: 'Wall Street Prep',
                    date: '2020-08'
                }
            ],
            achievements: [
                'Identified cost savings opportunities worth $2M through financial analysis',
                'Built financial models for 10+ successful M&A transactions',
                'Promoted to Senior Analyst within 2 years'
            ]
        }
    }

    ,{
        id: 'consultant',
        name: 'Business Consultant',
        description: 'Perfect for management consultants and strategy advisors',
        category: 'Business',
        color: 'blue',
        keywords: ['consultant', 'consulting', 'strategy', 'management consulting', 'business strategy', 'advisory', 'transformation'],
        data: {
            personalInfo: { fullName: 'Robert Chen', email: 'robert.chen@email.com', phone: '+1 (555) 567-8901', location: 'Chicago, IL', linkedin: 'linkedin.com/in/robertchen' },
            summary: 'Management Consultant with 7+ years advising Fortune 500 clients on strategy, operations, and digital transformation. MBA from top business school with track record of delivering measurable business impact.',
            experience: [
                { id: '1', company: 'McKinsey & Company', position: 'Management Consultant', location: 'Chicago, IL', startDate: '2019-08', endDate: 'Present', current: true, description: ['Advise C-suite executives on corporate strategy and transformation', 'Led 10+ engagements generating M+ in client value', 'Conducted market analysis and competitive benchmarking', 'Presented recommendations to Fortune 500 boards'] },
                { id: '2', company: 'Deloitte Consulting', position: 'Business Analyst', location: 'Chicago, IL', startDate: '2017-06', endDate: '2019-07', current: false, description: ['Supported strategy projects for healthcare and tech clients', 'Built financial models and business cases', 'Conducted stakeholder interviews and workshops'] }
            ],
            education: [{ id: '1', institution: 'Harvard Business School', degree: 'MBA', field: 'Strategy', location: 'Boston, MA', startDate: '2015', endDate: '2017', gpa: '3.9/4.0' }],
            skills: [
                { id: '1', category: 'Consulting', items: ['Strategy Development', 'Business Transformation', 'Change Management', 'Stakeholder Management'] },
                { id: '2', category: 'Analysis', items: ['Market Analysis', 'Financial Modeling', 'Data Analysis', 'Business Case Development'] },
                { id: '3', category: 'Tools', items: ['PowerPoint', 'Excel', 'Tableau', 'SQL'] }
            ],
            projects: [],
            certifications: [],
            achievements: ['Delivered M+ in client value', 'Promoted to Consultant in 18 months', 'Client satisfaction score: 4.9/5.0']
        }
    }
    ,{
        id: 'data-scientist',
        name: 'Data Scientist',
        description: 'Ideal for data scientists and machine learning engineers',
        category: 'Technology',
        color: 'purple',
        keywords: ['data scientist', 'machine learning', 'ai', 'python', 'data analysis', 'ml', 'deep learning', 'statistics', 'analytics'],
        data: {
            personalInfo: { fullName: 'Dr. Priya Sharma', email: 'priya.sharma@email.com', phone: '+1 (555) 678-9012', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/priyasharma', github: 'github.com/priyasharma' },
            summary: 'Data Scientist with PhD in Machine Learning and 5+ years building predictive models and AI solutions. Expert in Python, TensorFlow, and deploying ML models at scale. Published researcher with 10+ papers.',
            experience: [
                { id: '1', company: 'Meta', position: 'Senior Data Scientist', location: 'Menlo Park, CA', startDate: '2021-03', endDate: 'Present', current: true, description: ['Build ML models improving ad targeting by 30%', 'Deploy models serving 1B+ users daily', 'Lead team of 3 data scientists', 'Published 3 papers at top ML conferences'] },
                { id: '2', company: 'Uber', position: 'Data Scientist', location: 'San Francisco, CA', startDate: '2019-01', endDate: '2021-02', current: false, description: ['Developed demand forecasting models', 'Reduced prediction error by 25%', 'Built A/B testing framework'] }
            ],
            education: [{ id: '1', institution: 'Stanford University', degree: 'PhD', field: 'Machine Learning', location: 'Stanford, CA', startDate: '2015', endDate: '2019' }],
            skills: [
                { id: '1', category: 'ML/AI', items: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning'] },
                { id: '2', category: 'Programming', items: ['Python', 'R', 'SQL', 'Scala', 'Java'] },
                { id: '3', category: 'Tools', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Spark', 'AWS'] }
            ],
            projects: [],
            certifications: [],
            achievements: ['10+ published papers', 'Models serving 1B+ users', 'Kaggle Grandmaster']
        }
    }

    ,{
        id: 'devops-engineer',
        name: 'DevOps Engineer',
        description: 'Perfect for DevOps engineers and site reliability engineers',
        category: 'Technology',
        color: 'orange',
        keywords: ['devops', 'sre', 'kubernetes', 'docker', 'ci/cd', 'aws', 'cloud', 'infrastructure', 'automation'],
        data: {
            personalInfo: { fullName: 'Mike Torres', email: 'mike.torres@email.com', phone: '+1 (555) 789-0123', location: 'Seattle, WA', linkedin: 'linkedin.com/in/miketorres', github: 'github.com/miketorres' },
            summary: 'DevOps Engineer with 6+ years automating infrastructure and improving deployment pipelines. Expert in Kubernetes, AWS, and CI/CD. Reduced deployment time by 80% and improved system reliability to 99.99%.',
            experience: [
                { id: '1', company: 'Amazon Web Services', position: 'Senior DevOps Engineer', location: 'Seattle, WA', startDate: '2020-06', endDate: 'Present', current: true, description: ['Manage Kubernetes clusters serving 10M+ requests/day', 'Built CI/CD pipelines reducing deployment time from 2 hours to 15 minutes', 'Achieved 99.99% uptime SLA', 'Automated infrastructure with Terraform'] },
                { id: '2', company: 'Startup Inc', position: 'DevOps Engineer', location: 'Seattle, WA', startDate: '2018-03', endDate: '2020-05', current: false, description: ['Migrated infrastructure to AWS saving K/year', 'Implemented monitoring with Prometheus and Grafana', 'Reduced incident response time by 60%'] }
            ],
            education: [{ id: '1', institution: 'University of Washington', degree: 'BS', field: 'Computer Science', location: 'Seattle, WA', startDate: '2014', endDate: '2018' }],
            skills: [
                { id: '1', category: 'Cloud', items: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker'] },
                { id: '2', category: 'Tools', items: ['Terraform', 'Ansible', 'Jenkins', 'GitLab CI', 'Prometheus'] },
                { id: '3', category: 'Languages', items: ['Python', 'Bash', 'Go', 'YAML'] }
            ],
            projects: [],
            certifications: [{ id: '1', name: 'AWS Certified Solutions Architect', issuer: 'AWS', date: '2021-05' }, { id: '2', name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2020-09' }],
            achievements: ['Reduced deployment time by 80%', 'Achieved 99.99% uptime', 'Saved K in infrastructure costs']
        }
    }
    ,{
        id: 'qa-engineer',
        name: 'QA Engineer',
        description: 'Great for QA engineers and test automation specialists',
        category: 'Technology',
        color: 'teal',
        keywords: ['qa', 'quality assurance', 'testing', 'automation', 'selenium', 'test engineer', 'qa automation', 'software testing'],
        data: {
            personalInfo: { fullName: 'Amanda Lee', email: 'amanda.lee@email.com', phone: '+1 (555) 890-1234', location: 'Austin, TX', linkedin: 'linkedin.com/in/amandalee' },
            summary: 'QA Engineer with 5+ years building automated test frameworks and ensuring software quality. Expert in Selenium, Cypress, and CI/CD integration. Increased test coverage from 40% to 95%.',
            experience: [
                { id: '1', company: 'Tech Corp', position: 'Senior QA Engineer', location: 'Austin, TX', startDate: '2021-01', endDate: 'Present', current: true, description: ['Built automated test framework covering 95% of codebase', 'Reduced bug escape rate by 70%', 'Lead QA team of 4 engineers', 'Integrated tests into CI/CD pipeline'] },
                { id: '2', company: 'Software Co', position: 'QA Engineer', location: 'Austin, TX', startDate: '2019-06', endDate: '2020-12', current: false, description: ['Created 500+ automated test cases', 'Performed manual and automated testing', 'Reduced testing time by 60%'] }
            ],
            education: [{ id: '1', institution: 'UT Austin', degree: 'BS', field: 'Computer Science', location: 'Austin, TX', startDate: '2015', endDate: '2019' }],
            skills: [
                { id: '1', category: 'Testing', items: ['Test Automation', 'Manual Testing', 'API Testing', 'Performance Testing', 'Security Testing'] },
                { id: '2', category: 'Tools', items: ['Selenium', 'Cypress', 'Jest', 'Postman', 'JMeter'] },
                { id: '3', category: 'Languages', items: ['Java', 'Python', 'JavaScript', 'SQL'] }
            ],
            projects: [],
            certifications: [{ id: '1', name: 'ISTQB Certified Tester', issuer: 'ISTQB', date: '2020-03' }],
            achievements: ['Increased test coverage to 95%', 'Reduced bug escape rate by 70%', 'Built framework used by 20+ engineers']
        }
    }
    ,{
        id: 'system-administrator',
        name: 'System Administrator',
        description: 'Ideal for system administrators and IT infrastructure specialists',
        category: 'Technology',
        color: 'slate',
        keywords: ['sysadmin', 'system administrator', 'linux', 'windows server', 'network', 'it', 'infrastructure', 'server'],
        data: {
            personalInfo: { fullName: 'Tom Bradley', email: 'tom.bradley@email.com', phone: '+1 (555) 901-2345', location: 'Denver, CO', linkedin: 'linkedin.com/in/tombradley' },
            summary: 'System Administrator with 8+ years managing enterprise IT infrastructure. Expert in Linux/Windows servers, networking, and security. Maintained 99.9% uptime for 500+ servers.',
            experience: [
                { id: '1', company: 'Enterprise Corp', position: 'Senior System Administrator', location: 'Denver, CO', startDate: '2019-04', endDate: 'Present', current: true, description: ['Manage 500+ Linux and Windows servers', 'Maintained 99.9% uptime SLA', 'Implemented backup solution saving 10TB of data', 'Led server migration to cloud'] },
                { id: '2', company: 'IT Services Inc', position: 'System Administrator', location: 'Denver, CO', startDate: '2016-01', endDate: '2019-03', current: false, description: ['Managed network infrastructure for 200+ users', 'Implemented security policies', 'Reduced system downtime by 50%'] }
            ],
            education: [{ id: '1', institution: 'Colorado State', degree: 'BS', field: 'Information Technology', location: 'Fort Collins, CO', startDate: '2012', endDate: '2016' }],
            skills: [
                { id: '1', category: 'Systems', items: ['Linux', 'Windows Server', 'Active Directory', 'VMware', 'Hyper-V'] },
                { id: '2', category: 'Networking', items: ['TCP/IP', 'DNS', 'DHCP', 'VPN', 'Firewalls'] },
                { id: '3', category: 'Tools', items: ['PowerShell', 'Bash', 'Ansible', 'Nagios', 'Splunk'] }
            ],
            projects: [],
            certifications: [{ id: '1', name: 'Red Hat Certified Engineer', issuer: 'Red Hat', date: '2020-06' }, { id: '2', name: 'Microsoft Certified: Azure Administrator', issuer: 'Microsoft', date: '2021-03' }],
            achievements: ['Maintained 99.9% uptime', 'Managed 500+ servers', 'Reduced downtime by 50%']
        }
    }

    ,{
        id: 'content-writer',
        name: 'Content Writer',
        description: 'Perfect for content writers and copywriters',
        category: 'Marketing',
        color: 'purple',
        keywords: ['content writer', 'copywriter', 'writing', 'content', 'seo', 'blog', 'articles', 'creative writing'],
        data: {
            personalInfo: { fullName: 'Emily Parker', email: 'emily.parker@email.com', phone: '+1 (555) 012-3456', location: 'Portland, OR', linkedin: 'linkedin.com/in/emilyparker', website: 'emilyparker.com' },
            summary: 'Creative Content Writer with 5+ years crafting compelling copy and engaging content. Published 500+ articles with 10M+ views. Expert in SEO, storytelling, and content strategy.',
            experience: [
                { id: '1', company: 'Digital Media Co', position: 'Senior Content Writer', location: 'Portland, OR', startDate: '2021-02', endDate: 'Present', current: true, description: ['Write 20+ articles per month with average 50K views each', 'Increased organic traffic by 150% through SEO optimization', 'Manage content calendar for 5 brands', 'Mentor 3 junior writers'] },
                { id: '2', company: 'Marketing Agency', position: 'Content Writer', location: 'Portland, OR', startDate: '2019-06', endDate: '2021-01', current: false, description: ['Created content for 15+ clients across industries', 'Wrote blog posts, social media, email campaigns', 'Achieved 40% increase in engagement rates'] }
            ],
            education: [{ id: '1', institution: 'University of Oregon', degree: 'BA', field: 'English & Journalism', location: 'Eugene, OR', startDate: '2015', endDate: '2019' }],
            skills: [
                { id: '1', category: 'Writing', items: ['SEO Writing', 'Copywriting', 'Blog Writing', 'Technical Writing', 'Creative Writing'] },
                { id: '2', category: 'Tools', items: ['WordPress', 'Google Analytics', 'Grammarly', 'Hemingway', 'Ahrefs'] },
                { id: '3', category: 'Marketing', items: ['Content Strategy', 'Social Media', 'Email Marketing', 'Brand Voice'] }
            ],
            projects: [],
            certifications: [{ id: '1', name: 'HubSpot Content Marketing', issuer: 'HubSpot', date: '2020-08' }],
            achievements: ['Published 500+ articles with 10M+ views', 'Increased traffic by 150%', 'Featured in Forbes and Entrepreneur']
        }
    }
    ,{
        id: 'customer-success-manager',
        name: 'Customer Success Manager',
        description: 'Ideal for customer success and account management professionals',
        category: 'Business',
        color: 'blue',
        keywords: ['customer success', 'csm', 'account management', 'customer experience', 'retention', 'saas', 'client relations'],
        data: {
            personalInfo: { fullName: 'Jessica Brown', email: 'jessica.brown@email.com', phone: '+1 (555) 123-4567', location: 'San Diego, CA', linkedin: 'linkedin.com/in/jessicabrown' },
            summary: 'Customer Success Manager with 6+ years driving customer retention and growth in SaaS. Achieved 95% retention rate and M in upsell revenue. Expert in building relationships and ensuring customer satisfaction.',
            experience: [
                { id: '1', company: 'SaaS Company', position: 'Senior Customer Success Manager', location: 'San Diego, CA', startDate: '2020-08', endDate: 'Present', current: true, description: ['Manage portfolio of 50+ enterprise accounts worth M ARR', 'Achieved 95% customer retention rate', 'Generated M in upsell and expansion revenue', 'Reduced churn by 40% through proactive engagement'] },
                { id: '2', company: 'Tech Startup', position: 'Customer Success Manager', location: 'San Diego, CA', startDate: '2018-05', endDate: '2020-07', current: false, description: ['Onboarded 100+ new customers', 'Achieved NPS score of 72', 'Created customer success playbooks'] }
            ],
            education: [{ id: '1', institution: 'UC San Diego', degree: 'BA', field: 'Business Administration', location: 'San Diego, CA', startDate: '2014', endDate: '2018' }],
            skills: [
                { id: '1', category: 'Customer Success', items: ['Account Management', 'Customer Onboarding', 'Retention Strategy', 'Upselling', 'Relationship Building'] },
                { id: '2', category: 'Tools', items: ['Salesforce', 'Gainsight', 'Intercom', 'Zendesk', 'HubSpot'] },
                { id: '3', category: 'Metrics', items: ['NPS', 'CSAT', 'Churn Rate', 'Customer Lifetime Value'] }
            ],
            projects: [],
            certifications: [{ id: '1', name: 'Certified Customer Success Manager', issuer: 'SuccessCoaching', date: '2021-04' }],
            achievements: ['95% retention rate', 'M in upsell revenue', 'NPS score of 72']
        }
    }
];
