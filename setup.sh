#!/bin/bash

echo "🚀 Starting Blockchain Application Setup..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start containers
echo "📦 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Setup Laravel
echo ""
echo "🔧 Setting up Laravel backend..."
docker exec blockchain_laravel composer install --no-interaction --optimize-autoloader
docker exec blockchain_laravel cp .env.example .env
docker exec blockchain_laravel php artisan key:generate
docker exec blockchain_laravel php artisan migrate --force

# Setup React
echo ""
echo "⚛️  Setting up React frontend..."
docker exec blockchain_react npm install

# Restart containers
echo ""
echo "🔄 Restarting containers..."
docker-compose restart

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000/api"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop app:     docker-compose down"
echo "   Restart app:  docker-compose restart"
echo ""
echo "Happy coding! 🎉"
