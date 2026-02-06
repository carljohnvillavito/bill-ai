#!/bin/bash

# Set service account credentials
export GOOGLE_APPLICATION_CREDENTIALS="/home/ubuntu/.openclaw/workspace/bill-ai-backend/service-account-key.json"

# Start the backend server
cd /home/ubuntu/.openclaw/workspace/bill-ai-backend
echo "🚀 Starting Bill AI Backend..."
echo "📁 Service Account: $GOOGLE_APPLICATION_CREDENTIALS"
echo ""
npm start
