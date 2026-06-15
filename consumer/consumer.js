const { Kafka } = require('kafkajs');
const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: { type: 'pattern', pattern: '%m' },
    },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
  },
});

const logger = log4js.getLogger();

const kafka = new Kafka({
  clientId: 'sre-consumer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
  retry: {
    retries: 10,
    initialRetryTime: 3000,
  },
});

async function run() {
  const consumer = kafka.consumer({ groupId: 'sre-cdc-group' });

  await consumer.connect();

  const topic = process.env.KAFKA_TOPIC || 'tidb-cdc';
  await consumer.subscribe({ topic, fromBeginning: true });

  logger.info(JSON.stringify({
    timestamp: new Date().toISOString(),
    service: 'kafka-consumer',
    status: 'connected',
    topic,
  }));

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = message.value?.toString();
        if (!value) return;

        const event = JSON.parse(value);

        logger.info(JSON.stringify({
          timestamp: new Date().toISOString(),
          service: 'cdc-consumer',
          topic,
          partition,
          offset: message.offset,
          database: event.database,
          table: event.table,
          type: event.type,
          isDdl: event.isDdl,
          data: event.data,
          old: event.old,
        }));
      } catch (err) {
        logger.info(JSON.stringify({
          timestamp: new Date().toISOString(),
          service: 'cdc-consumer',
          error: 'Failed to parse message',
          raw: message.value?.toString().slice(0, 200),
        }));
      }
    },
  });
}

run().catch((err) => {
  console.error('Consumer failed to start:', err);
  process.exit(1);
});
