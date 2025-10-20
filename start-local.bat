@echo off
echo ========================================
echo QuickNotes - Startup Script
echo ========================================
echo.

echo [1/4] Starting PostgreSQL and Redis with Docker...
docker-compose -f docker-compose.simple.yml up -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start Docker services
    echo Please make sure Docker is running
    pause
    exit /b 1
)

echo.
echo [2/4] Waiting for databases to be ready...
timeout /t 10 /nobreak > nul

echo.
echo [3/4] Starting Backend (NestJS)...
start "QuickNotes Backend" cmd /k "cd nestjs && npm run start:dev"

timeout /t 3 /nobreak > nul

echo.
echo [4/4] Starting Frontend (React)...
start "QuickNotes Frontend" cmd /k "cd react && npm run dev"

echo.
echo ========================================
echo ✅ QuickNotes is starting!
echo ========================================
echo.
echo Frontend will open at: http://localhost:8080
echo Backend API at: http://localhost:3000
echo.
echo Two terminal windows will open:
echo   - Backend (NestJS)
echo   - Frontend (React)
echo.
echo To stop: Close both terminal windows
echo          and run: docker-compose -f docker-compose.simple.yml down
echo.
pause
