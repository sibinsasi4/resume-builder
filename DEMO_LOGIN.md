# 🎭 Demo Login Credentials

## Quick Access

Use these credentials to instantly access the platform and test all features:

```
Email:    demo@visish.com
Password: demo123
```

---

## How to Use Demo Account

### 1. Access Login Page

Navigate to: **<http://localhost:3000/login>**

### 2. Enter Credentials

- **Email:** `demo@visish.com`
- **Password:** `demo123`

### 3. Click "Sign In"

You'll be redirected to the dashboard with a pre-populated resume!

---

## What's Included in Demo Account

### ✅ Pre-configured User Profile

- Name: Demo User
- Current Role: Software Developer
- Target Role: Senior Software Engineer
- Experience Level: Intermediate

### ✅ Sample Resume

- Title: "My Professional Resume"
- Template: Modern (Purple theme)
- Complete with:
  - Personal information
  - Work experience (Tech Solutions Pvt Ltd)
  - Education (Mumbai University - B.Tech CS)
  - Skills (JavaScript, React, Node.js, PostgreSQL, etc.)
  - Projects (E-commerce Platform)

### ✅ Free Tier Access

- 1 resume download available
- 3 AI analyses per month
- Access to basic templates
- Can upgrade to Pro anytime

---

## Testing the Monetization Features

### 1. View Usage Limits

- Go to dashboard
- Check the usage widget on the right sidebar
- See downloads and AI analyses remaining

### 2. Test Upgrade Flow

- Click "Upgrade" button in usage widget
- Pricing modal will appear
- Select a plan (Pay Per Download or Monthly Pro)
- Choose payment gateway (Razorpay or Stripe)
- **Note:** You'll need test API keys configured to complete payment

### 3. Try AI Analysis

- Click "Analyze" on the sample resume
- Paste a job description
- See ATS score and job match analysis
- Usage counter will decrement

### 4. Download Resume

- Click "Edit" on the sample resume
- Customize if desired
- Click download/export
- **Free tier:** PDF will have watermark
- **Pro tier:** No watermark

---

## Create Demo Account (If Not Already Created)

If the demo account doesn't exist yet, create it by:

### Option 1: API Call

```bash
curl -X POST http://localhost:3000/api/demo
```

### Option 2: Browser

Navigate to: `http://localhost:3000/api/demo`

This will create the demo user with the credentials above.

---

## Demo Account Features

| Feature | Status | Details |
|---------|--------|---------|
| Login Access | ✅ | Instant access with demo credentials |
| Sample Resume | ✅ | Pre-populated professional resume |
| Free Tier | ✅ | 1 download, 3 AI analyses/month |
| Upgrade Flow | ✅ | Can test pricing modal |
| Payment Test | ⚠️ | Requires API keys configured |
| Admin Access | ❌ | Demo user is not admin |

---

## Upgrade Demo User to Pro (Optional)

To test Pro features without payment, manually update in database:

```sql
-- Create Pro subscription for demo user
INSERT INTO "Subscription" (
  id, "userId", plan, status, "billingCycle", 
  amount, currency, "downloadsLimit", "analysesLimit",
  "currentPeriodStart", "currentPeriodEnd", "createdAt", "updatedAt"
)
SELECT 
  gen_random_uuid(),
  id,
  'pro',
  'active',
  'monthly',
  299,
  'INR',
  30,
  0,
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  NOW()
FROM "User" 
WHERE email = 'demo@visish.com';
```

After this, demo user will have:

- ✅ 30 downloads per month
- ✅ Unlimited AI analyses
- ✅ All premium templates
- ✅ No watermarks

---

## Create Admin Demo User (Optional)

To test admin portal:

```sql
-- Make demo user an admin
UPDATE "User" 
SET role = 'admin' 
WHERE email = 'demo@visish.com';
```

Then access: **<http://localhost:3000/admin>**

---

## Testing Checklist

### Basic Features

- [ ] Login with demo credentials
- [ ] View dashboard
- [ ] See sample resume
- [ ] Check usage widget
- [ ] Edit resume
- [ ] Run AI analysis

### Monetization Features

- [ ] Click upgrade button
- [ ] View pricing modal
- [ ] Select payment gateway
- [ ] See plan comparison
- [ ] Test usage limits

### Advanced Features

- [ ] Create new resume
- [ ] Download PDF
- [ ] Check watermark (free tier)
- [ ] View analytics
- [ ] Test subscription status

---

## Quick Start Commands

```bash
# Start development server (if not running)
cd "/Users/sibin/Resume builder"
npm run dev

# Create demo user
curl -X POST http://localhost:3000/api/demo

# Open login page
open http://localhost:3000/login
```

---

## Demo Credentials Summary

```
🔐 LOGIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:    demo@visish.com
Password: demo123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Login URL: http://localhost:3000/login
```

**Copy these credentials and use them to explore the platform!** 🚀
