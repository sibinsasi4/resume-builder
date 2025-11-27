# 🚀 QUICK SETUP GUIDE

## ⚠️ Database Setup Required

Your app needs a PostgreSQL database to work. Here's how to set it up:

### Option 1: Use SQLite (Easiest - No Installation)

1. **Update Prisma schema** to use SQLite instead of PostgreSQL:

```bash
# Edit prisma/schema.prisma
# Change line 8-9 from:
  provider = "postgresql"
  url      = env("DATABASE_URL")

# To:
  provider = "sqlite"
  url      = "file:./dev.db"
```

2. **Push the schema**:

```bash
npx prisma db push
```

3. **Create demo user**:

```bash
npx prisma studio
# Or visit the /api/demo endpoint after server starts
```

### Option 2: Use PostgreSQL (Production-Ready)

1. **Install PostgreSQL**:

```bash
brew install postgresql@14
brew services start postgresql@14
```

2. **Create database**:

```bash
createdb visish
```

3. **Add to .env.local**:

```
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/visish"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this"
```

4. **Generate secret**:

```bash
openssl rand -base64 32
```

5. **Push schema**:

```bash
npx prisma db push
```

### Option 3: Use Vercel Postgres (Free Cloud)

1. **Deploy to Vercel** (free):

```bash
npm install -g vercel
vercel
```

2. **Add Postgres** in Vercel dashboard:
   - Go to Storage → Create → Postgres
   - Copy DATABASE_URL

3. **Add to environment variables** in Vercel

4. **Redeploy**

---

## 🎯 Quick Start (SQLite - Recommended for Testing)

Run these commands:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Update prisma/schema.prisma (change provider to sqlite)

# 3. Push database
npx prisma db push

# 4. Start server
npm run dev

# 5. Visit http://localhost:3000/api/demo to create demo user

# 6. Login with demo@visish.com / demo123
```

---

## 📝 Manual Login (Without Database)

If you don't want to set up database yet, you can:

1. Comment out database-dependent features
2. Use static pages only
3. Or deploy to Vercel with their free Postgres

---

## ✅ After Setup

Once database is configured:

- Demo login will work
- Admin portal will work
- Resume creation will work
- All features enabled!

---

**Need help?** Check README.md or SETUP.md for detailed instructions.
