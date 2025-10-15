#!/bin/bash
# ----------------------------------------------------------------------
# File: run-locust.sh
# Path: tests/load/run-locust.sh
# Author: Gemini & SG Man, System Architects
# Created: August 14, 2025 at 11:30 PDT
# Version: 1.0.1 (Enhanced with Error Handling)
# 👑 Cod1 Crown Certified
# ----------------------------------------------------------------------
#
# @description
# Shell script to run Locust load tests in a Dockerized environment.
#
# @architectural_notes
# - **Automated**: Launches Locust with a single command.
# - **Observable**: Exports metrics to Prometheus.
# - **Resilient**: Includes error handling for Docker and Locust.
#
# @todos
# - @free:
#   - [x] Run Locust in Dockerized environment.
# - @premium:
#   - [ ] ✨ Add distributed load testing support.
# - @wow:
#   - [ ] 🚀 Integrate AI-driven load test optimization.
#
# ----------------------------------------------------------------------
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed."
    exit 1
fi

# Stop any existing Locust containers
docker-compose -f tests/load/docker-compose.locust.yml down 2>/dev/null

# Build and run Locust service
docker-compose -f tests/load/docker-compose.locust.yml up --build -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to start Locust."
    exit 1
fi

echo "Locust is starting up..."
echo "Access the web UI at http://localhost:8089"
echo "Run 'docker-compose -f tests/load/docker-compose.locust.yml down' to stop the test."