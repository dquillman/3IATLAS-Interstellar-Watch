# Simple Google Cloud Deployment Script
Write-Host "Deploying 3I/ATLAS to Google Cloud..." -ForegroundColor Cyan

# Login
Write-Host "`nStep 1: Login..." -ForegroundColor Yellow
gcloud auth login

# Set project
Write-Host "`nStep 2: Setting project..." -ForegroundColor Yellow
gcloud config set project 3iatlas-app

# Create project if needed
Write-Host "`nStep 3: Creating project..." -ForegroundColor Yellow
gcloud projects create 3iatlas-app --name="3I/ATLAS" 2>$null

# Enable APIs
Write-Host "`nStep 4: Enabling APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Get API key
Write-Host "`nStep 5: Enter your OpenAI API Key:" -ForegroundColor Yellow
$apiKey = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
$plainKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Create secret
Write-Host "`nStep 6: Storing API key..." -ForegroundColor Yellow
Write-Output $plainKey | gcloud secrets create OPENAI_API_KEY --data-file=- 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Output $plainKey | gcloud secrets versions add OPENAI_API_KEY --data-file=-
}

# Deploy
Write-Host "`nStep 7: Deploying (this takes 5-10 minutes)..." -ForegroundColor Yellow
gcloud run deploy 3iatlas-app --source . --platform managed --region us-central1 --allow-unauthenticated --set-env-vars VITE_USE_BACKEND=true --set-secrets VITE_API_KEY=OPENAI_API_KEY:latest --memory 512Mi --cpu 1 --timeout 300

# Get URL
Write-Host "`n=== DEPLOYMENT COMPLETE ===" -ForegroundColor Green
$url = gcloud run services describe 3iatlas-app --region us-central1 --format "value(status.url)"
Write-Host "Your app: $url" -ForegroundColor Cyan
