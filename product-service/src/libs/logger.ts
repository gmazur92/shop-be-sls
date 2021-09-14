import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

export const writeLog = (event, context) => {
  logger.defaultMeta = {requestId: context.awsRequestId, resource: event.resource};
  logger.info({pathParameters: event.pathParameters, body: event.body});
}

export const writeError = (error) => {
  logger.defaultMeta = {statusCode: error.statusCode};
  logger.error(error.message);
}
