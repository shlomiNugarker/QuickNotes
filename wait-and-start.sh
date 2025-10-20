#!/bin/bash

echo "🔄 QuickNotes - Waiting for Docker Hub to be available..."
echo "=================================================="
echo ""

MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "[$ATTEMPT/$MAX_ATTEMPTS] Checking Docker Hub availability..."

    # Try to pull a small image to test connectivity
    if docker pull postgres:15-alpine 2>&1 | grep -q "Downloaded newer image\|Image is up to date\|Pull complete"; then
        echo ""
        echo "✅ Docker Hub is available! Starting the build process..."
        echo ""

        # Build all images
        echo "🔨 Building Docker images..."
        docker-compose build

        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Build successful! Starting all services..."
            echo ""

            # Start all services
            docker-compose up -d

            if [ $? -eq 0 ]; then
                echo ""
                echo "🎉 SUCCESS! All services are starting up..."
                echo ""
                echo "⏳ Waiting 15 seconds for services to initialize..."
                sleep 15

                echo ""
                echo "📊 Service Status:"
                docker-compose ps

                echo ""
                echo "✅ QuickNotes is ready!"
                echo ""
                echo "📝 Access the application:"
                echo "   Frontend:        http://localhost:8080"
                echo "   API:             http://localhost:3000"
                echo "   Health Check:    http://localhost:3000/health"
                echo "   Metrics:         http://localhost:3000/metrics"
                echo ""
                echo "📋 View logs:        docker-compose logs -f"
                echo "🛑 Stop services:    docker-compose down"
                echo ""
                exit 0
            else
                echo "❌ Failed to start services. Check the logs."
                exit 1
            fi
        else
            echo "❌ Build failed. Check the error messages above."
            exit 1
        fi
    else
        echo "⏳ Docker Hub still unavailable. Waiting 2 minutes before retry..."
        echo "   (You can press Ctrl+C to stop waiting)"
        sleep 120
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

echo ""
echo "❌ Docker Hub was not available after $MAX_ATTEMPTS attempts (60 minutes)."
echo "   Please check https://status.docker.com/ for updates."
echo "   You can run this script again later: ./wait-and-start.sh"
echo ""
exit 1
