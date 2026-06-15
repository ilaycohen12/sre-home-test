#!/bin/sh

echo "Waiting for TiCDC to be ready..."
while true; do
  if curl -sf http://ticdc:8300/api/v1/status > /dev/null 2>&1; then
    break
  fi
  echo "TiCDC not ready, retrying in 5s..."
  sleep 5
done

echo "TiCDC is ready."

if curl -sf http://ticdc:8300/api/v1/changefeeds/sre-cdc > /dev/null 2>&1; then
  echo "Changefeed sre-cdc already exists, skipping."
  exit 0
fi

echo "Creating changefeed..."
curl -X POST http://ticdc:8300/api/v1/changefeeds \
  -H "Content-Type: application/json" \
  -d '{
    "changefeed_id": "sre-cdc",
    "sink_uri": "kafka://kafka:29092/tidb-cdc?protocol=canal-json&replication-factor=1",
    "replica_config": {
      "filter": {
        "rules": ["sre_app.*"]
      }
    }
  }'

echo "Changefeed sre-cdc created successfully."
