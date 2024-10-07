# Makefile for OSM data import using osm2pgsql

# Variables
DOCKER_COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yml

# Default target
.PHONY: all
all: import

# Import OSM data
.PHONY: import
import:
	@echo "Starting OSM data import..."
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up osm2pgsql
	@echo "OSM data import completed."

# Clean up containers and volumes
.PHONY: clean
clean:
	@echo "Cleaning up Docker containers and volumes..."
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down -v
	@echo "Cleanup completed."

# Show help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  import  - Import OSM data using osm2pgsql"
	@echo "  clean   - Remove Docker containers and volumes"
	@echo "  help    - Show this help message"
