# Visish - AI-Powered Resume Builder & Job Match Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## 🚀 Features

### Resume Builder

- **5 Professional Templates**: Classic, Modern, Creative, Minimal, Professional
- **Real-time Preview**: See changes instantly as you edit
- **Drag & Drop Editor**: Intuitive interface for easy customization
- **Color Themes**: Multiple color schemes to match your style
- **Font Options**: Choose from Sans, Serif, and Mono fonts
- **PDF Export**: Download professional PDF resumes

### Job Match Analysis

- **ATS Score**: Check how well your resume passes Applicant Tracking Systems
- **Job Match Score**: See how well you match job requirements
- **Skills Analysis**: Identify skill gaps and strengths
- **SWOT Analysis**: Get comprehensive strengths, weaknesses, opportunities analysis
- **AI Recommendations**: Receive actionable suggestions to improve your resume
- **Resume Upload**: Analyze any resume (PDF/DOCX) against job descriptions

### User Management

- **Authentication**: Secure login with NextAuth
- **Demo Account**: Try the platform without signing up
- **Admin Dashboard**: Manage users and view platform statistics
- **Subscription Plans**: Free, Pro, Premium, and Pay-per-use options

### Payment Integration

- **Razorpay**: For Indian users
- **Stripe**: For international users
- **Flexible Plans**: Monthly and yearly billing options

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **PDF Generation**: @react-pdf/renderer
- **File Parsing**: pdf-parse, mammoth
- **AI/NLP**: Natural (keyword extraction, text analysis)
- **Payments**: Stripe, Razorpay

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Local Setup

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/resume-builder.git
cd resume-builder
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: <http://localhost:3000> (for local dev)

4. **Set up database**

```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. **Add Environment Variables** in Vercel dashboard
4. **Deploy!**

See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for detailed instructions.

## 📖 Usage

### Demo Account

Click "Try Demo Account" on the login page to explore the platform without signing up.

### Creating a Resume

1. Sign up or use demo account
2. Click "Create New Resume"
3. Choose a template
4. Fill in your information
5. Customize colors and fonts
6. Download as PDF

### Analyzing Resume

1. Go to "Analysis" from dashboard
2. Choose mode:
   - **Use Existing Resume**: Analyze resumes created in the editor
   - **Upload Resume**: Upload PDF/DOCX files
3. Paste job description
4. Click "Run Analysis"
5. Review scores, SWOT analysis, and suggestions

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── templates/         # Resume templates
│   └── ui/                # UI components
├── lib/                   # Utility functions
│   ├── ai/                # AI analysis services
│   └── auth.ts            # Authentication config
├── prisma/                # Database schema
└── public/                # Static assets
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Authentication secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `RAZORPAY_KEY_ID` | Razorpay API key | No |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Templates inspired by modern resume design trends
- AI analysis powered by natural language processing
- Built with Next.js and Vercel

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Made with ❤️ for job seekers worldwide**
