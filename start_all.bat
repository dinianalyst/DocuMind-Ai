@echo off
title DocuMind AI — Start All Services
echo ====================================================
echo Starting DocuMind AI (Backend + Frontend)
echo ====================================================

:: Set Node path if not in system PATH
set "PATH=%LOCALAPPDATA%\Programs\nodejs;C:\Program Files\nodejs;%PATH%"

echo Starting Backend (FastAPI on http://127.0.0.1:8000)...
start "DocuMind Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo Starting Frontend (Vite on http://localhost:5173)...
start "DocuMind Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ====================================================
echo All services launched!
echo App URL:     http://localhost:5173
echo API Swagger: http://127.0.0.1:8000/docs
echo ====================================================
pause
