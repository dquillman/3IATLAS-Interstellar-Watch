# PowerShell Deployment Script for Google Cloud Run
# Run this in PowerShell (not Git Bash)

Write-Host "🚀 3I/ATLAS Google Cloud Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ID = "3iatlas-app"
$REGION = "us-central1"
$SERVICE_NAME = "3iatlas-app"

# Step 1: Login
Write-Host "Step 1: Logging in to Google Cloud..." -ForegroundColor Yellow
gcloud auth login

# Step 2: Create/Set Project
Write-Host "`nStep 2: Setting up project..." -ForegroundColor Yellow
$projectExists = gcloud projects list --filter="projectId:$PROJECT_ID" --format="value(projectId)" 2>$null

if ($projectExists) {
    Write-Host "Project already exists. Setting as active..." -ForegroundColor Green
    gcloud config set project $PROJECT_ID
} else {
    Write-Host "Creating new project..." -ForegroundColor Green
    gcloud projects create $PROJECT_ID --name="3I/ATLAS Interstellar Watch"
    gcloud config set project $PROJECT_ID

    Write-Host "`n⚠️  IMPORTANT: You must enable billing for this project!" -ForegroundColor Red
    Write-Host "Visit: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID" -ForegroundColor Yellow
    $continue = Read-Host "`nPress Enter after enabling billing, or 'q' to quit"
    if ($continue -eq 'q') { exit }
}

# Step 3: Enable APIs
Write-Host "`nStep 3: Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Step 4: Create Secret
Write-Host "`nStep 4: Storing OpenAI API Key..." -ForegroundColor Yellow
$apiKey = Read-Host "Enter your OpenAI API Key" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
$plainKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Check if secret exists
$secretExists = gcloud secrets list --filter="name:OPENAI_API_KEY" --format="value(name)" 2>$null

if ($secretExists) {
    Write-Host "Secret already exists. Creating new version..." -ForegroundColor Green
    echo -n $plainKey | gcloud secrets versions add OPENAI_API_KEY --data-file=-
} else {
    Write-Host "Creating new secret..." -ForegroundColor Green
    echo -n $plainKey | gcloud secrets create OPENAI_API_KEY --data-file=-
}

# Step 5: Deploy
Write-Host "`nStep 5: Deploying to Cloud Run..." -ForegroundColor Yellow
Write-Host "This will take 5-10 minutes..." -ForegroundColor Cyan

gcloud run deploy $SERVICE_NAME `
  --source . `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars VITE_USE_BACKEND=true `
  --set-secrets VITE_API_KEY=OPENAI_API_KEY:latest `
  --memory 512Mi `
  --cpu 1 `
  --timeout 300 `
  --max-instances 10

# Step 6: Get URL
Write-Host "`n✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
$url = gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
Write-Host "🌐 Your app is live at: $url" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 View in Google Cloud Console:" -ForegroundColor Yellow
Write-Host "https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/metrics?project=$PROJECT_ID"
