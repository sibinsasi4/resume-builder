# Vercel Resume Builder - Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/resume-builder)

## Prerequisites

- Node.js 18+ installed
- GitHub account
- Vercel account (free tier available)

## Deployment Steps

### 1. Fork/Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/resume-builder.git
cd resume-builder
npm install
```

### 2. Set Up Database

This project uses PostgreSQL. You have two options:

**Option A: Vercel Postgres (Recommended)**

- Vercel provides free PostgreSQL database
- Automatically configured when deploying

**Option B: External PostgreSQL**

- Use Supabase, Railway, or any PostgreSQL provider
- Get your DATABASE_URL connection string

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your deployed URL (e.g., <https://your-app.vercel.app>)

Optional (for payment features):

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### 4. Deploy to Vercel

**Method 1: Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel
```

**Method 2: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy!

### 5. Run Database Migrations

After deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

Or use Vercel's dashboard to run:

```bash
npx prisma migrate deploy
```

## Environment Variables in Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Authentication secret | `generated-random-string` |
| `NEXTAUTH_URL` | Your deployed URL | `https://your-app.vercel.app` |

## Post-Deployment

1. Visit your deployed URL
2. Create an admin account
3. Test the demo login feature
4. Upload a resume and test analysis

## Troubleshooting

### Database Connection Issues

- Ensure DATABASE_URL is correctly formatted
- Check if database is accessible from Vercel
- Verify Prisma migrations have run

### Build Failures

- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Authentication Issues

- Verify NEXTAUTH_SECRET is set
- Ensure NEXTAUTH_URL matches your domain
- Check if cookies are enabled

## Local Development

```bash
# Install dependencies
npm install

# Set up local database
npx prisma migrate dev

# Run development server
npm run dev
```

## Support

For issues, please check:

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
