# Complete Setup Script for 3I/ATLAS Desktop Icon
# This script creates the icon and desktop shortcut

$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$iconPath = Join-Path $scriptPath "app.ico"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  3I/ATLAS Desktop Icon Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create a simple icon if it doesn't exist
if (-not (Test-Path $iconPath)) {
    Write-Host "Creating application icon..." -ForegroundColor Yellow
    
    # Try to download a simple space/comet icon, or create a placeholder
    # For now, we'll use a system icon as fallback and create instructions
    Write-Host "  Note: Using default icon. You can replace app.ico with a custom icon later." -ForegroundColor Gray
    
    # Create a simple text file with instructions for now
    $iconInstructions = @"
To add a custom icon:
1. Create or download a .ico file (256x256 or 128x128 recommended)
2. Name it 'app.ico' and place it in this directory
3. Re-run this setup script

You can create icons at:
- https://www.icoconverter.com/
- https://convertio.co/png-ico/
- Use any image editor to create and convert to .ico format
"@
    
    Set-Content -Path (Join-Path $scriptPath "ICON_INSTRUCTIONS.txt") -Value $iconInstructions
}

# Run the shortcut creation script
Write-Host ""
Write-Host "Creating desktop shortcut..." -ForegroundColor Yellow
& (Join-Path $scriptPath "create-desktop-shortcut.ps1")

Write-Host ""
Write-Host "[OK] Setup complete!" -ForegroundColor Green
Write-Host ""

