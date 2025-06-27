#!/bin/bash

# 🔍 FarmCare AI - Setup Validation Script
# This script validates that the project structure is correctly set up

echo "🌱 FarmCare AI - Project Setup Validation"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the FarmCareAi root directory"
    exit 1
fi

echo "✅ Directory structure looks good"

# Check Node.js and npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ Node.js and npm are available"

# Check Python
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed"
    exit 1
fi

echo "✅ Python is available"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "⚠️  Root dependencies not installed. Run: npm install"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed. Run: npm run install-frontend"
    exit 1
fi

echo "✅ Dependencies are installed"

# Check if backend files exist
if [ ! -f "backend/app.py" ]; then
    echo "❌ Backend app.py not found"
    exit 1
fi

if [ ! -f "backend/crop_model.pkl" ]; then
    echo "❌ ML model file not found"
    exit 1
fi

echo "✅ Backend files are present"

# Check if frontend files exist
if [ ! -f "frontend/index.html" ]; then
    echo "❌ Frontend index.html not found"
    exit 1
fi

if [ ! -f "frontend/src/App.tsx" ]; then
    echo "❌ Frontend App.tsx not found"
    exit 1
fi

echo "✅ Frontend files are present"

# Test if ports are available
if lsof -i :5173 &> /dev/null; then
    echo "⚠️  Port 5173 is in use (Frontend will use alternative port)"
fi

if lsof -i :5000 &> /dev/null; then
    echo "⚠️  Port 5000 is in use (Backend may conflict)"
fi

echo ""
echo "🎉 Setup validation completed successfully!"
echo ""
echo "📋 Quick Start Commands:"
echo "  npm run dev          # Start both frontend and backend"
echo "  npm run frontend     # Start frontend only"
echo "  npm run backend      # Start backend only"
echo ""
echo "🌐 Application URLs:"
echo "  Frontend: http://localhost:5173/"
echo "  Backend:  http://127.0.0.1:5000/"
echo "  Health:   http://127.0.0.1:5000/health"
echo ""
echo "🏗️ Project Structure:"
echo "  frontend/  - React TypeScript application"
echo "  backend/   - Flask Python API server"
echo "  supabase/  - Database migrations"
echo ""
