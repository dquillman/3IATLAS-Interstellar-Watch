# Fix Secret Manager Permissions and Deploy
Write-Host "Step 1: Granting Secret Manager access to Cloud Run service account..." -ForegroundColor Yellow

gcloud secrets add-iam-policy-binding OPENAI_API_KEY --member="serviceAccount:1006706589038-compute@developer.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"

Write-Host "`nStep 2: Deploying to Cloud Run (this takes 5-10 minutes)..." -ForegroundColor Yellow

gcloud run deploy iatlas-app --source . --platform managed --region us-central1 --allow-unauthenticated --set-env-vars VITE_USE_BACKEND=true --set-secrets VITE_API_KEY=OPENAI_API_KEY:latest --memory 512Mi --cpu 1 --timeout 300

Write-Host "`n=== DEPLOYMENT COMPLETE ===" -ForegroundColor Green
$url = gcloud run services describe iatlas-app --region us-central1 --format "value(status.url)"
Write-Host "Your app is live at: $url" -ForegroundColor Cyan
