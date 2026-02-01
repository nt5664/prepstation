#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
ENV_FILE=".env.production"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$PROJECT_DIR"

echo "*** CHECKING ENV FILE ***"
if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} Cannot be found"
  exit 1
fi

echo "*** STARTING STACK ***"
docker compose ${COMPOSE_FILES} up -d

echo "*** DONE ***"
echo "Services running:"
docker compose ${COMPOSE_FILES} ps