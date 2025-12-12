@echo off
echo ========================================
echo   PORT 5000 KULLANIM KONTROLU
echo ========================================
echo.
echo Port 5000'i kullanan islemler araniyor...
echo.
netstat -ano | findstr :5000
echo.
echo.
echo Yukaridaki listede PID numarasi var.
echo Eger bir islem goruyorsaniz, asagidaki komutu calistirin:
echo   taskkill /PID [PID_NUMARASI] /F
echo.
echo Ornek: taskkill /PID 12345 /F
echo.
echo Otomatik olarak kapatmak icin devam edin...
pause
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo PID %%a bulundu, kapatiliyor...
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo Hata: Islem kapatilamadi. Yonetici olarak calistirmayi deneyin.
    ) else (
        echo Basarili: Port 5000 serbest birakildi!
    )
)
echo.
pause

