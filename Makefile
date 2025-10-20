.PHONY: help setup up down build logs clean restart health

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Initial setup - copy .env.example to .env
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env file from .env.example"; \
		echo "⚠️  Please update .env with your configuration"; \
	else \
		echo "⚠️  .env already exists"; \
	fi

up: ## Start all services in production mode
	docker-compose up -d
	@echo "✅ All services started"
	@echo "📝 Frontend: http://localhost:8080"
	@echo "🔧 API Load Balancer: http://localhost:3000"
	@echo "📊 Health Check: http://localhost:3000/health"
	@echo "📈 Metrics: http://localhost:3000/metrics"

dev: ## Start all services in development mode with hot reload
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up

down: ## Stop all services
	docker-compose down

build: ## Build all Docker images
	docker-compose build

logs: ## Show logs from all services
	docker-compose logs -f

logs-api: ## Show logs from API services
	docker-compose logs -f api-1 api-2

logs-frontend: ## Show logs from frontend service
	docker-compose logs -f frontend

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

restart: ## Restart all services
	docker-compose restart

health: ## Check health of all services
	@echo "Checking service health..."
	@curl -f http://localhost:3000/health || echo "❌ API Load Balancer: DOWN"
	@curl -f http://localhost:8080/health || echo "❌ Frontend: DOWN"
	@echo "✅ Health check completed"

install-backend: ## Install backend dependencies
	cd nestjs && npm install

install-frontend: ## Install frontend dependencies
	cd react && npm install

install: install-backend install-frontend ## Install all dependencies

test: ## Run tests
	cd nestjs && npm test
