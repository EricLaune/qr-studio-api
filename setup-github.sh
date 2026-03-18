#!/bin/bash

# QR Studio API - GitHub Setup Script
# Run this to push to GitHub and connect to Vercel

echo "🚀 QR Studio API - GitHub Setup"
echo "================================"
echo ""

# Check if git remote exists
if git remote | grep -q "origin"; then
    echo "✅ Git remote already configured"
else
    echo "⚠️  No git remote configured"
    echo ""
    echo "Next steps:"
    echo "1. Create a new private repo on GitHub: https://github.com/new"
    echo "   Name: qr-studio-api"
    echo "   Visibility: Private"
    echo ""
    echo "2. Run this command to add remote:"
    echo "   git remote add origin https://github.com/EricLaune/qr-studio-api.git"
    echo ""
    echo "3. Push to GitHub:"
    echo "   git push -u origin main"
    echo ""
fi

echo ""
echo "📦 Files ready to push:"
git status --short

echo ""
echo "🔗 Connect to Vercel:"
echo "1. Go to https://vercel.com/new"
echo "2. Import from GitHub"
echo "3. Select 'qr-studio-api' repo"
echo "4. Deploy!"
echo ""
echo "Done! Your API will be live at: https://qr-studio-api.vercel.app"