const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%m',
      },
    },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
  },
});

const logger = log4js.getLogger();

function logUserActivity({ userId, action, ip }) {
  logger.info(JSON.stringify({
    timestamp: new Date().toISOString(),
    userId,
    action,
    ip,
  }));
}

module.exports = { logger, logUserActivity };
