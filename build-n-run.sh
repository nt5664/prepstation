#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
ENV_FILE=".env.production"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$PROJECT_DIR"

echo "*** CHECKING ENV FILE ***"
if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} cannot be found"
  exit 1
fi

# Opcionális: gyors szintaxis ellenőrzés
if ! command -v docker &>/dev/null; then
  echo "ERROR: Docker cannot be found"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: Docker compose caqnnot be found. Docker Compose V2 is required."
  exit 1
fi

echo "*** BUILDING ***"
docker compose ${COMPOSE_FILES} build --pull

echo "*** STARTING STACK ***"
docker compose ${COMPOSE_FILES} up -d

echo "Services running:"
docker compose ${COMPOSE_FILES} ps

echo "*** DONE ***"
echo "Logs: docker logs -f prepstation_[db/app]"