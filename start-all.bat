@echo off
echo ========================================
echo   EGZERSIZLAB - TUM SERVISLER
echo ========================================
echo.
echo Bu script iki ayri CMD penceresi acacak:
echo   1. Backend (Port 5000)
echo   2. Frontend (Port 3000)
echo.
echo Her iki servis de baslatildiktan sonra:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5000
echo.
pause
echo.
echo Portlar temizleniyor...
echo Port 5000 kontrol ediliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Port 3000 kontrol ediliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo.
echo Backend baslatiliyor...
start "EgzersizLab Backend" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Frontend baslatiliyor...
start "EgzersizLab Frontend" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Her iki servis de baslatildi!
echo.
echo Servisleri kapatmak icin her iki pencerede de Ctrl+C yapin.
echo.
pause

