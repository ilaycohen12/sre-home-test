# opening

This project was build as part of a SRE home assignment.
while making it, i used claude (for simple coding), TiDB docs, kafkaJS docs, log4js docs and Confluent kafka Docker image.
I made sure to understand every decision so i can explain it.
thank you for the opportunity. i hope this project will satisfy you!

## SRE Home Test

Full-stack app with authentication, TiDB, Kafka, and CDC-based change monitoring.

## Stack

- **Frontend** – Basic HTML served by Nginx
- **Backend** – Node.js + Express
- **Database** – TiDB (PD + TiKV + TiDB)
- **Message Queue** – Apache Kafka + Zookeeper
- **CDC** – TiCDC streaming DB changes to Kafka
- **Logging** – log4js

## How to run

``` bash
docker compose up --build
```
That's it.
Once up, open http://localhost in your browser.
Default user- username: `ilay` / password: `helfy`

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
## example:
``` bash
{"timestamp":"2026-06-15T10:49:26.127Z","service":"cdc-consumer","topic":"tidb-cdc","partition":2,"offset":"0","database":"sre_app","table":"tokens","type":"INSERT","isDdl":false,"data":[{"id":"1","user_id":"1","token":"986503f29bae8543d4378bafd7ce91f8cf12793406c49487ab08204c0d4961f8","expires_at":"2026-06-16 10:49:25","created_at":"2026-06-15 10:49:24"}],"old":null}
```
## To watch logs:
``` bash
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
## Technologies used (from the requirements)

- **HTML** - frontend/index.html
- **Node.js with Express.js** - backend/main-app-layout.js, backend/package.json
- **TiDB** - docker-compose.yml + db/connection.js
- **Apache kafka** - docker-compose.yml + consumer/consumer.js
- **Docker & Compose** - docker-compose.yml, backend/Dockerfile, frontend/Dockerfile, db/Dockerfile, cdc-init/Dockerfile, consumer/Dockerfile
- **log4js** - backend/logger.js, consumer/consumer.js


