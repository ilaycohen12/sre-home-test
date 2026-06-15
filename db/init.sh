#!/bin/sh
set -e

echo "Waiting for TiDB to be ready..."
until mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT 1" > /dev/null 2>&1; do
  echo "TiDB not ready yet, retrying in 3s..."
  sleep 3
done

echo "TiDB is ready. Running schema..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" < /app/init.sql

echo "Running seed..."
node /app/seed.js

echo "DB init complete."
