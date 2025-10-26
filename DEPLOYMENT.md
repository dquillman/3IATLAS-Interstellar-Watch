# 3I/ATLAS - Google Cloud Deployment Guide

## Prerequisites

1. **Install Google Cloud CLI**: https://cloud.google.com/sdk/docs/install
2. **OpenAI API Key**: Get from https://platform.openai.com/api-keys

## Quick Deployment

### 1. Login to Google Cloud
```bash
gcloud auth login
```

### 2. Set your project
```bash
# Create new project (or use existing)
gcloud projects create 3iatlas-app --name="3I/ATLAS"

# Set as active project
gcloud config set project 3iatlas-app

# Enable billing (required for Cloud Run)
# Visit: https://console.cloud.google.com/billing
```

### 3. Enable required APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 4. Store your OpenAI API key securely
```bash
# Replace YOUR_OPENAI_API_KEY with your actual key
echo -n "YOUR_OPENAI_API_KEY" | gcloud secrets create OPENAI_API_KEY --data-file=-
```

### 5. Deploy to Cloud Run
```bash
cd G:\Users\daveq\3iatlas

gcloud run deploy 3iatlas-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_USE_BACKEND=true \
  --set-secrets VITE_API_KEY=OPENAI_API_KEY:latest \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10
```

### 6. Get your app URL
```bash
gcloud run services describe 3iatlas-app \
  --region us-central1 \
  --format 'value(status.url)'
```

## Your app will be available at:
`https://3iatlas-app-XXXXX-uc.a.run.app`

## Costs

Google Cloud Run pricing (free tier):
- **2 million requests/month** - FREE
- **360,000 GB-seconds/month** - FREE
- **180,000 vCPU-seconds/month** - FREE

Your app will likely stay within free tier limits for personal use.

## Update Deployment

To deploy updates after code changes:

```bash
git pull  # Get latest code
gcloud run deploy 3iatlas-app --source . --region us-central1
```

## View Logs

```bash
gcloud run logs read 3iatlas-app --region us-central1 --limit 50
```

## Delete Service

```bash
gcloud run services delete 3iatlas-app --region us-central1
```

## Troubleshooting

**Issue**: "Permission denied" errors
- **Solution**: Enable billing at https://console.cloud.google.com/billing

**Issue**: Secret not found
- **Solution**: Make sure you created the secret in step 4

**Issue**: Build fails
- **Solution**: Check build logs with `gcloud builds list`

## Security Notes

✅ Your OpenAI API key is stored in Google Secret Manager (encrypted)
✅ API key is never exposed to the browser
✅ Backend proxy protects all OpenAI API calls
✅ HTTPS enabled by default on Cloud Run

## Monitoring

View your app in Google Cloud Console:
https://console.cloud.google.com/run
