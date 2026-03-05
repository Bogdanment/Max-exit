#!/bin/bash

# Script to setup and start the application with Docker

echo "🚀 Starting Exit Accessories with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create uploads directory
mkdir -p backend/uploads

# Build and start containers
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting containers..."
docker-compose up

echo "✅ Application started!"
echo "📍 Frontend: http://localhost:3001"
echo "📍 API: http://localhost:5000/api"
