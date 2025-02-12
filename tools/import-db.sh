#!/bin/bash
set -e
trap 'echo "Import database failed"' ERR

DB_NAME="lms"
MONGO_URI="mongodb://host.docker.internal:27017/$DB_NAME"

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
DB_DIR="$SCRIPT_DIR/db"

echo "Deleting database..."

docker run --rm \
  --add-host host.docker.internal:host-gateway \
  -it mongo:8.0.0 \
  bash -c "mongosh \"$MONGO_URI\" --eval \"db.getSiblingDB('$DB_NAME').dropDatabase()\""

echo "Database deleted successfully."

echo "Importing database..."

docker run --rm \
  -v "$DB_DIR:/mongo-seed" \
  --add-host host.docker.internal:host-gateway \
  -it mongo:8.0.0 \
  bash -c "mongorestore --uri '$MONGO_URI' /mongo-seed"

echo "Database imported successfully."
