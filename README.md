# SRE Home Test

Full-stack app with authentication, TiDB, Kafka, and CDC-based change monitoring.

## Stack

- **Frontend** – Basic HTML served by Nginx
- **Backend** – Node.js + Express
- **Database** – TiDB (PD + TiKV + TiDB)
- **Message Queue** – Apache Kafka + Zookeeper
- **CDC** – TiCDC streaming DB changes to Kafka
- **Logging** – log4js

## How to run

```
docker compose up --build
```

That's it. Everything starts automatically in the right order.

Once up, open http://localhost in your browser.

Default user: `admin` / `Admin123`

## What happens on startup

1. PD, TiKV, and TiDB start up and become healthy
2. `db-init` runs — creates the schema and seeds the default user
3. Zookeeper and Kafka start up
4. TiCDC starts and connects to PD
5. `cdc-init` creates a changefeed that streams all `sre_app` table changes to the `tidb-cdc` Kafka topic
6. The `consumer` service connects to Kafka and starts listening for CDC events
7. Backend and frontend start

## Logging

**User activity** – every login writes a JSON entry to the backend container logs:
```json
{"timestamp":"...","userId":1,"action":"LOGIN","ip":"::ffff:172.18.0.1"}
```

**DB changes** – every insert/update/delete in `sre_app` is captured by TiCDC, sent to Kafka, and logged by the consumer:
```json
{"timestamp":"...","service":"cdc-consumer","database":"sre_app","table":"tokens","type":"INSERT","data":[{...}]}
```

To watch logs:
```
docker compose logs -f backend     # user activity logs
docker compose logs -f consumer    # CDC change logs
```

## Project structure

```
sre-project/
├── backend/         # Node.js API
├── frontend/        # HTML + Nginx
├── db/              # Schema, seed, init script
├── cdc-init/        # Creates the TiCDC changefeed on startup
├── consumer/        # Kafka consumer for CDC events
└── docker-compose.yml
```
