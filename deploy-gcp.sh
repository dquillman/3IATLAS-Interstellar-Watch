#!/bin/bash

# Google Cloud Run Deployment Script for 3I/ATLAS Interstellar Watch

echo "🚀 Deploying 3I/ATLAS to Google Cloud Run..."

# Set your project ID
PROJECT_ID="your-project-id"  # CHANGE THIS
REGION="us-central1"
SERVICE_NAME="3iatlas-app"

# Build and deploy
echo "📦 Building and deploying container..."

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars VITE_USE_BACKEND=true,VITE_BACKEND_URL=https://${SERVICE_NAME}-${PROJECT_ID}.run.app \
  --set-secrets VITE_API_KEY=OPENAI_API_KEY:latest \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🌐 Your app is available at: https://${SERVICE_NAME}-${PROJECT_ID}.run.app"
