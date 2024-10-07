# Makefile for OSM data import using osm2pgsql

# Variables
DOCKER_COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yml

# Default target
.PHONY: all
all: import

.PHONY: run
import:
	@echo "Running Martin..."
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up martin