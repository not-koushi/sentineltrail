#!/bin/bash
set -e

echo "🧹 Resetting SentinelTrail demo environment..."

echo "🛑 Stopping containers and removing volumes..."
docker compose down -v

echo "🧼 Cleaning unused Docker resources..."
docker system prune -f

echo "🚀 Rebuilding and starting fresh containers..."
docker compose up -d --build

echo "✅ Demo environment reset complete."
echo "👉 You can now restart the dashboard and begin demo."