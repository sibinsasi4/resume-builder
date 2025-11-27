#!/bin/bash

# VISISH - Quick Deployment Script
# This script helps you deploy your Resume Builder to production

echo "🚀 VISISH Deployment Helper"
echo "============================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - VISISH Resume Builder"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   → Go to https://github.com/new"
echo "   → Name it 'visish' or 'resume-builder'"
echo "   → Don't initialize with README"
echo ""
echo "2. Push your code to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   → Go to https://vercel.com/new"
echo "   → Import your GitHub repository"
echo "   → Add environment variables:"
echo "     - DATABASE_URL (from Vercel Postgres)"
echo "     - NEXTAUTH_URL (your vercel app URL)"
echo "     - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
echo ""
echo "4. Set up database:"
echo "   → In Vercel: Storage → Create → Postgres"
echo "   → Copy DATABASE_URL to environment variables"
echo "   → Run: npx prisma db push"
echo ""
echo "5. Your app will be live! 🎉"
echo ""
echo "💰 Monetization:"
echo "   → See DEPLOYMENT_GUIDE.md for full monetization strategies"
echo "   → Add Stripe for payments"
echo "   → Create pricing tiers"
echo "   → Start marketing!"
echo ""
echo "📚 Documentation:"
echo "   → README.md - Technical documentation"
echo "   → DEPLOYMENT_GUIDE.md - Complete deployment & monetization guide"
echo "   → SETUP.md - Local development setup"
echo ""
echo "Good luck! 🚀"
