# VISISH Setup Guide

## Quick Start

Follow these steps to get VISISH running on your machine:

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:

**macOS (using Homebrew):**

```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or use Postgres.app:**
Download from <https://postgresapp.com/>

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE visish;

# Create user (optional)
CREATE USER visish_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE visish TO visish_user;

# Exit
\q
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://visish_user:your_password@localhost:5432/visish"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-key-here"
```

**Generate a secure secret:**

```bash
openssl rand -base64 32
```

### 4. Set Up Database Schema

```bash
npx prisma db push
```

This creates all necessary tables.

### 5. Run the Application

```bash
npm run dev
```

Open <http://localhost:3000> in your browser!

## Troubleshooting

### Database Connection Issues

If you see "Environment variable not found: DATABASE_URL":

- Make sure `.env` file exists in the project root
- Check that DATABASE_URL is correctly formatted
- Verify PostgreSQL is running: `brew services list` or check Postgres.app

### Port Already in Use

If port 3000 is busy:

```bash
npm run dev -- -p 3001
```

### Prisma Issues

If Prisma commands fail:

```bash
npx prisma generate
npx prisma db push
```

## Default Database URL

If you're using default PostgreSQL settings:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/visish"
```

## Next Steps

1. Sign up at <http://localhost:3000/signup>
2. Complete onboarding
3. Create your first resume!

## Need Help?

Check the main README.md for detailed documentation.
