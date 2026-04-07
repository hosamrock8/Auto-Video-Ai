@echo off
echo ==========================================
echo   Lumina AI Video Production Studio
echo ==========================================
echo Starting Backend Services...
start "Lumina Backend" cmd /k "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

echo Starting Frontend Studio...
cd frontend
start "Lumina Frontend" cmd /k "npm run dev"

echo Opening Studio in Browser...
timeout /t 5
start http://localhost:3000

echo ==========================================
echo   Studio is now running! 
echo   Keep the terminal windows open.
echo ==========================================
pause
