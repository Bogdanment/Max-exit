@echo off
REM Script to setup and start the application with Docker (Windows)

echo 🚀 Starting Exit Accessories with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop for Windows.
    pause
    exit /b 1
)

echo ✅ Docker is installed

REM Create uploads directory
if not exist "backend\uploads" mkdir backend\uploads

REM Build and start containers
echo 🔨 Building Docker images...
docker-compose build

echo 🚀 Starting containers...
docker-compose up

echo ✅ Application started!
echo 📍 Frontend: http://localhost:3001
echo 📍 API: http://localhost:5000/api

pause
