Write-Host "🧹 Resetting SentinelTrail demo environment..." -ForegroundColor Cyan

Write-Host "🛑 Stopping containers and removing volumes..." -ForegroundColor Yellow
docker compose down -v

Write-Host "🧼 Cleaning unused Docker resources..." -ForegroundColor Yellow
docker system prune -f

Write-Host "🚀 Rebuilding and starting fresh containers..." -ForegroundColor Green
docker compose up -d --build

Write-Host "✅ Demo environment reset complete." -ForegroundColor Green
Write-Host "👉 You can now restart the dashboard and demo." -ForegroundColor Cyan