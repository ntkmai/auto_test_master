@echo off
cls
echo ========================================
echo   Web Black Box Testing Tool
echo ========================================
echo.
echo Dang khoi dong server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Chua cai dat dependencies. Dang cai dat...
    call npm install
    echo.
)

REM Build TypeScript
echo Dang compile TypeScript...
call npm run build
echo.

REM Start server in background
echo Khoi dong server...
start /B npm run server

REM Wait for server to start
timeout /t 3 /nobreak > nul

REM Open browser
echo Mo Chrome...
start http://localhost:3000

echo.
echo ========================================
echo Server dang chay tai: http://localhost:3000
echo Nhan Ctrl+C de dung server
echo ========================================
echo.

REM Keep window open
pause
