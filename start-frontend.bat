@echo off
echo ========================================
echo   EGZERSIZLAB FRONTEND BASLATILIYOR
echo ========================================
echo.
cd /d "%~dp0"
echo Ana klasore gecildi...
echo.
echo Port 3000 kontrol ediliyor...
set PORT_FOUND=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do (
    set PORT_FOUND=1
    echo Port 3000 kullanimda! PID %%a kapatiliyor...
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo UYARI: PID %%a kapatilamadi, yonetici haklari gerekebilir.
    ) else (
        echo PID %%a basariyla kapatildi.
    )
)
if %PORT_FOUND%==1 (
    echo Port 3000 temizleniyor, 2 saniye bekleniyor...
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
echo Frontend baslatiliyor (Port: 3000)...
echo Frontend adresi: http://localhost:3000
echo.
npm run dev
pause

