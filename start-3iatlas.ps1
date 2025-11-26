# start-3iatlas.ps1 — minimal starter for 3i/atlas
$ErrorActionPreference = "Stop"
Write-Host "`n=== 3i/atlas starter (lite) ===" -ForegroundColor Cyan
Write-Host "PWD: $(Get-Location)"

function Try-Run($label, $exe, $args) {
  Write-Host "`n-- $label --" -ForegroundColor Yellow
  Write-Host ">>> $exe $args" -ForegroundColor DarkYellow
  try {
    & $exe $args
    exit $LASTEXITCODE
  } catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor DarkRed
  }
}

# Free port 5000 if stuck
$net = (netstat -ano | Select-String ":5000\s") | ForEach-Object { $_.ToString() }
if ($net) {
  $pid = ($net -split '\s+')[-1]
  if ($pid -match '^\d+$') {
    Write-Host "Killing PID $pid on :5000"
    taskkill /PID $pid /F | Out-Null
  }
}

# Prefer venv if present
if (Test-Path .\.venv\Scripts\Activate.ps1) { . .\.venv\Scripts\Activate.ps1; Write-Host "Activated .venv" -ForegroundColor Green }

# If Python deps file exists, hint
if (Test-Path .\requirements.txt) { Write-Host "Tip: pip install -r requirements.txt (if modules are missing)" -ForegroundColor DarkCyan }

# Try most common FastAPI/Flask entry points
Try-Run "Uvicorn main:app"  "uvicorn" "main:app --host 127.0.0.1 --port 5000 --reload"
Try-Run "Uvicorn app:app"   "uvicorn" "app:app  --host 127.0.0.1 --port 5000 --reload"
Try-Run "Flask app:app"     "python"  "-m flask --app app:app --debug run --host 127.0.0.1 --port 5000"
Try-Run "Flask main:app"    "python"  "-m flask --app main:app --debug run --host 127.0.0.1 --port 5000"

# If Node project, try dev/start
if (Test-Path .\package.json) {
  Write-Host "`nDetected package.json — installing deps (npm i)…" -ForegroundColor Cyan
  try { npm i } catch {}
  Try-Run "npm run dev"     "npm" "run dev"
  Try-Run "npm start"       "npm" "start"
}

Write-Host "`nNo standard entry worked. We need the actual module or script name (e.g., main.py with app = FastAPI())." -ForegroundColor Red
