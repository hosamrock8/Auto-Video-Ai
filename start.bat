@echo off
title Lumina Studio - AI Video Production
color 0A
echo.
echo  =====================================================
echo     LUMINA STUDIO  ^|  AI Video Production Engine
echo  =====================================================
echo.

:: Check if .env exists, if not copy from example
if not exist ".env" (
    echo  [SETUP] Creating .env from template...
    copy ".env.example" ".env" > nul
    echo  [SETUP] Please edit .env and add your API keys!
    echo.
)

echo  [1/3] Installing Python dependencies...
pip install -r api/requirements.txt -q
echo  [OK] Backend dependencies ready.
echo.

echo  [2/3] Starting FastAPI Backend on port 8000...
start "Lumina Backend (Port 8000)" cmd /k "python -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload"

echo  [3/3] Starting Next.js Frontend on port 3000...
cd frontend
start "Lumina Frontend (Port 3000)" cmd /k "npm run dev"
cd ..

echo.
echo  [WAIT] Waiting 5 seconds for services to start...
timeout /t 5 /nobreak > nul

echo.
echo  [OPEN] Opening Lumina Studio in browser...
start http://localhost:3000

echo.
echo  =====================================================
echo   Studio is LIVE at: http://localhost:3000
echo   Backend API at:    http://localhost:8000/docs
echo   Keep both terminal windows open!
echo  =====================================================
echo.
pause
