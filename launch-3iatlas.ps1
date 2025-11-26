# 3I/ATLAS Interstellar Watch - Desktop Launcher
# This script launches both the backend server and frontend dev server

$ErrorActionPreference = "Continue"

# Get the script directory (where the app is located)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  3I/ATLAS Interstellar Watch" -ForegroundColor Cyan
Write-Host "  Launching Application..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found! Please install Node.js first." -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists, if not, install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host ""
    Write-Host "⚠ Warning: .env.local not found!" -ForegroundColor Yellow
    Write-Host "  The app may not work without VITE_API_KEY configured." -ForegroundColor Yellow
    Write-Host "  Create .env.local with: VITE_API_KEY=your_key_here" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Starting application servers..." -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API: http://localhost:2112" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor DarkGray
Write-Host ""

# Launch both frontend and backend using concurrently
npm run dev:all

# If dev:all fails, try running them separately
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Concurrently failed, trying separate processes..." -ForegroundColor Yellow
    
    # Start backend in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; npm run dev:backend" -WindowStyle Minimized
    
    # Wait a moment for backend to start
    Start-Sleep -Seconds 2
    
    # Start frontend (this will block)
    npm run dev
}

