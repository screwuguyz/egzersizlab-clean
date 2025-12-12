@echo off
echo ========================================
echo   PORT 3000 ZORLA TEMIZLEME
echo ========================================
echo.
echo Port 3000'i kullanan TUM islemler kapatilacak...
echo.
echo Port 3000'i kullanan islemler:
netstat -ano | findstr :3000
echo.
echo.
set /p CONFIRM="Devam etmek istiyor musunuz? (E/H): "
if /i not "%CONFIRM%"=="E" (
    echo Islem iptal edildi.
    pause
    exit /b
)
echo.
echo Islemler kapatiliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do (
    echo PID %%a kapatiliyor...
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo [HATA] PID %%a kapatilamadi - Yonetici haklari gerekebilir
    ) else (
        echo [OK] PID %%a kapatildi
    )
)
echo.
echo Port kontrol ediliyor...
timeout /t 2 /nobreak >nul
netstat -ano | findstr :3000
if errorlevel 1 (
    echo.
    echo [BASARILI] Port 3000 serbest!
) else (
    echo.
    echo [UYARI] Port 3000 hala kullanimda olabilir.
    echo Yonetici olarak calistirmayi deneyin.
)
echo.
pause

