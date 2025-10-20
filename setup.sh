#!/bin/bash

echo "🚀 QuickNotes Setup Script"
echo "=========================="
echo ""

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
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please review and update .env with your configuration"
else
    echo "⚠️  .env file already exists"
fi

echo ""
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "✅ QuickNotes is ready!"
echo ""
echo "📝 Access the application:"
echo "   Frontend:        http://localhost:8080"
echo "   API:             http://localhost:3000"
echo "   Health Check:    http://localhost:3000/health"
echo "   Metrics:         http://localhost:3000/metrics"
echo ""
echo "📊 Check service status:"
echo "   docker-compose ps"
echo ""
echo "📋 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
