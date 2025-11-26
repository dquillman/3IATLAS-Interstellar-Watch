# Create Desktop Shortcut for 3I/ATLAS Interstellar Watch
# Run this script once to create the desktop shortcut

$ErrorActionPreference = "Stop"

# Get paths
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "3I-ATLAS Interstellar Watch.lnk"
$launcherPath = Join-Path $scriptPath "launch-3iatlas.ps1"
$iconPath = Join-Path $scriptPath "app.ico"

Write-Host ""
Write-Host "Creating desktop shortcut..." -ForegroundColor Cyan
Write-Host "  Target: $launcherPath" -ForegroundColor White
Write-Host "  Desktop: $shortcutPath" -ForegroundColor White
Write-Host ""

# Create WScript Shell object
$WScriptShell = New-Object -ComObject WScript.Shell

# Create shortcut
$Shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-WindowStyle Hidden -Command `"Start-Process 'https://atlas-interstellar-watch.web.app'`""
$Shortcut.WorkingDirectory = $scriptPath
$Shortcut.Description = "3I/ATLAS Interstellar Watch - Live Mission Control"
$Shortcut.WindowStyle = 7  # Minimized/Hidden (since we're just launching a URL)

# Set icon if it exists
if (Test-Path $iconPath) {
    $Shortcut.IconLocation = $iconPath
} else {
    # Use PowerShell icon as fallback
    $Shortcut.IconLocation = "powershell.exe,0"
}

$Shortcut.Save()

Write-Host "[OK] Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now double-click '3I-ATLAS Interstellar Watch' on your desktop" -ForegroundColor Cyan
Write-Host "to launch the application." -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to open the shortcut location
$response = Read-Host "Open desktop folder? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Start-Process explorer.exe -ArgumentList "/select,`"$shortcutPath`""
}

