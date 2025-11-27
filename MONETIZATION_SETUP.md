# 🚀 Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Razorpay account (for Indian payments)
- Stripe account (for international payments)

## Step 1: Install Dependencies

```bash
cd "/Users/sibin/Resume builder"
npm install
```

## Step 2: Set Up Database

### Option A: Use Vercel Postgres (Recommended)

1. Go to <https://vercel.com/storage/postgres>
2. Create new database
3. Copy connection string

### Option B: Local PostgreSQL

```bash
createdb resume_builder
```

## Step 3: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - Run: `openssl rand -base64 32`
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - From <https://dashboard.razorpay.com/>
- `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From <https://dashboard.stripe.com/>

## Step 4: Run Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Step 5: Start Development Server

```bash
npm run dev
```

Visit <http://localhost:3000>

## Step 6: Test Payment Flow

1. Sign up at <http://localhost:3000/signup>
2. Go to dashboard
3. Click "Upgrade" button
4. Select a plan
5. Use Razorpay test card: `4111 1111 1111 1111`

## Step 7: Access Admin Portal

```sql
-- Set your user as admin
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

Visit <http://localhost:3000/admin>

---

## 🎯 Next Steps

1. **Get Payment Gateway Keys**
   - Razorpay: <https://dashboard.razorpay.com/signup>
   - Stripe: <https://dashboard.stripe.com/register>

2. **Test All Features**
   - Payment flows
   - Subscription management
   - Usage limits
   - Admin dashboard

3. **Deploy to Production**
   - Use Vercel for hosting
   - Set up production database
   - Configure webhooks

---

## 📚 Documentation

- [Implementation Plan](file:///Users/sibin/.gemini/antigravity/brain/cd065703-eee0-46d2-af60-23a8a07a7ee2/implementation_plan.md)
- [Walkthrough](file:///Users/sibin/.gemini/antigravity/brain/cd065703-eee0-46d2-af60-23a8a07a7ee2/walkthrough.md)
- [Task Checklist](file:///Users/sibin/.gemini/antigravity/brain/cd065703-eee0-46d2-af60-23a8a07a7ee2/task.md)

---

## 🆘 Troubleshooting

**Database connection error?**

- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running

**Payment not working?**

- Verify API keys in `.env.local`
- Check browser console for errors
- Ensure you're using test mode keys

**Prisma errors?**

- Run `npx prisma generate`
- Delete `node_modules` and run `npm install`

---

**Ready to monetize! 💰**
