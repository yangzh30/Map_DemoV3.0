@echo off
cd /d "%~dp0"
taskkill /f /im node.exe 2>nul
timeout /t 1 /nobreak >nul
start "" npm run dev
timeout /t 6 /nobreak >nul
start http://localhost:3000/#/territory-old
