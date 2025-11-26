# Fresh Docker Build and Deploy to Google Cloud Run
# Forces a complete rebuild with no cache to ensure all changes are included

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fresh Deploy v1.5.1 to Google Cloud Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$PROJECT_ID = "iatlas-app-421310461607"
$SERVICE_NAME = "iatlas-app"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"
$VERSION = "v1.5.1"

# Step 1: Authenticate with Google Cloud
Write-Host "`nStep 1: Checking authentication..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to set project. Please run 'gcloud auth login' first." -ForegroundColor Red
    exit 1
}

# Step 2: Configure Docker to use gcloud credentials
Write-Host "`nStep 2: Configuring Docker authentication..." -ForegroundColor Yellow
gcloud auth configure-docker
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to configure Docker authentication." -ForegroundColor Red
    exit 1
}

# Step 3: Build Docker image with NO CACHE
Write-Host "`nStep 3: Building Docker image (NO CACHE - this may take 5-10 minutes)..." -ForegroundColor Yellow
Write-Host "Image: ${IMAGE_NAME}:${VERSION}" -ForegroundColor Cyan
docker build --no-cache -t "${IMAGE_NAME}:${VERSION}" -t "${IMAGE_NAME}:latest" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Push image to Google Container Registry
Write-Host "`nStep 4: Pushing image to Google Container Registry..." -ForegroundColor Yellow
docker push "${IMAGE_NAME}:${VERSION}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker push failed!" -ForegroundColor Red
    exit 1
}

docker push "${IMAGE_NAME}:latest"

# Step 5: Deploy to Cloud Run
Write-Host "`nStep 5: Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --image="${IMAGE_NAME}:${VERSION}" `
    --platform=managed `
    --region=$REGION `
    --allow-unauthenticated `
    --memory=512Mi `
    --cpu=1 `
    --timeout=300 `
    --project=$PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

# Step 6: Get service URL
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$SERVICE_URL = gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" --project=$PROJECT_ID
Write-Host "`nYour app is live at:" -ForegroundColor Cyan
Write-Host $SERVICE_URL -ForegroundColor White

Write-Host "`nVersion: $VERSION" -ForegroundColor Cyan
Write-Host "`nTest the deployment:" -ForegroundColor Yellow
Write-Host "curl $SERVICE_URL/api/health" -ForegroundColor Gray
