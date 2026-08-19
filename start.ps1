Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting DocuMind AI (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$env:Path = "$env:LOCALAPPDATA\Programs\nodejs;" + $env:Path
$projectRoot = $PSScriptRoot

Write-Host "Starting Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = '$env:LOCALAPPDATA\Programs\nodejs;' + `$env:Path; cd '$projectRoot\frontend'; npm run dev"

Write-Host "`nAll services launched!" -ForegroundColor Yellow
Write-Host "Web App URL:     http://localhost:5173" -ForegroundColor White
Write-Host "API Swagger:     http://127.0.0.1:8000/docs" -ForegroundColor White
