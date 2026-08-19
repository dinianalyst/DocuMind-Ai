@echo off
title DocuMind AI — Frontend Server
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d %~dp0frontend
echo Starting React Vite Frontend on http://localhost:5173 ...
npm run dev
pause
