@echo off
echo ========================================
echo   EGZERSIZLAB BACKEND BASLATILIYOR
echo ========================================
echo.
cd /d "%~dp0server"
echo Backend klasorune gecildi...
echo.
echo Port 5000 kontrol ediliyor...
set PORT_FOUND=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 2^>nul') do (
    set PORT_FOUND=1
    echo Port 5000 kullanimda! PID %%a kapatiliyor...
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo UYARI: PID %%a kapatilamadi, yonetici haklari gerekebilir.
    ) else (
        echo PID %%a basariyla kapatildi.
    )
)
if %PORT_FOUND%==1 (
    echo Port 5000 temizleniyor, 2 saniye bekleniyor...
    timeout /t 2 /nobreak >nul
)
echo.
echo Node modulleri kontrol ediliyor...
if not exist "node_modules" (
    echo Node modulleri yukleniyor...
    call npm install
    echo.
)
echo.
echo Backend baslatiliyor (Port: 5000)...
echo.
npm run dev
pause

