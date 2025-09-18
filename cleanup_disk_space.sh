#!/bin/bash

# Disk Space Cleanup Script for PyTorch Installation
# This script helps free up disk space so you can install PyTorch

echo "🧹 Disk Space Cleanup for PyTorch Installation"
echo "=============================================="

# Check current disk space
echo "📊 Current disk usage:"
df -h

echo ""
echo "🔍 Finding large files and directories to clean..."

# Function to safely remove directory
safe_remove() {
    if [ -d "$1" ]; then
        echo "  - Removing: $1"
        rm -rf "$1"
    fi
}

# Function to clean pip cache
clean_pip_cache() {
    echo "🗑️  Cleaning pip cache..."
    pip cache purge 2>/dev/null || echo "  - No pip cache to clean"
}

# Function to clean Python cache
clean_python_cache() {
    echo "🐍 Cleaning Python cache files..."
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true
}

# Function to clean node modules (if any)
clean_node_modules() {
    echo "📦 Looking for node_modules to clean..."
    find . -name "node_modules" -type d | while read dir; do
        echo "  - Found: $dir ($(du -sh "$dir" | cut -f1))"
        read -p "    Remove this? (y/n): " confirm
        if [[ $confirm == [yY] ]]; then
            rm -rf "$dir"
            echo "    ✅ Removed"
        fi
    done
}

# Function to clean system caches
clean_system_caches() {
    echo "💻 Cleaning system caches..."
    
    # Clean user caches
    if [ -d ~/Library/Caches ]; then
        echo "  - Cleaning user caches..."
        find ~/Library/Caches -type f -atime +7 -delete 2>/dev/null || true
    fi
    
    # Clean downloads folder of old files
    if [ -d ~/Downloads ]; then
        echo "  - Cleaning old downloads (>30 days)..."
        find ~/Downloads -type f -atime +30 -delete 2>/dev/null || true
    fi
}

# Function to clean homebrew cache
clean_homebrew() {
    if command -v brew &> /dev/null; then
        echo "🍺 Cleaning Homebrew cache..."
        brew cleanup 2>/dev/null || echo "  - No Homebrew cleanup needed"
    fi
}

# Main cleanup process
echo "Starting cleanup process..."
echo ""

# Clean Python-related caches
clean_pip_cache
clean_python_cache

# Clean development caches
clean_node_modules

# Clean system caches
clean_system_caches

# Clean homebrew
clean_homebrew

# Clean Docker if present
if command -v docker &> /dev/null; then
    echo "🐳 Docker found. Clean Docker images? (This will remove unused images)"
    read -p "Clean Docker? (y/n): " docker_confirm
    if [[ $docker_confirm == [yY] ]]; then
        docker system prune -f 2>/dev/null || echo "  - Docker cleanup failed"
    fi
fi

echo ""
echo "🗂️  Checking for large files in current directory..."
find . -type f -size +100M 2>/dev/null | head -10 | while read file; do
    size=$(du -sh "$file" | cut -f1)
    echo "  - Large file: $file ($size)"
done

echo ""
echo "📊 Disk usage after cleanup:"
df -h

echo ""
echo "💡 Additional space-saving tips:"
echo "1. Empty Trash/Bin"
echo "2. Clear browser caches and downloads"
echo "3. Remove old applications you don't use"
echo "4. Move large files to external storage"
echo "5. Use 'Storage Management' in System Preferences (macOS)"

echo ""
echo "🔧 Alternative PyTorch installation options:"
echo "1. Install CPU-only PyTorch (smaller): pip install torch --index-url https://download.pytorch.org/whl/cpu"
echo "2. Use PyTorch Lite: pip install torch torchvision --no-deps"
echo "3. Install in steps: pip install torch first, then torchvision"

echo ""
echo "✅ Cleanup complete! Try installing PyTorch again:"
echo "   pip install torch torchvision"
