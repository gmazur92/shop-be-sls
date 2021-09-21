import { handlerPath } from '@libs/handlerResolver';
import { UPLOADS } from '../../config/config';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'socks-shop-bucket',
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: `${UPLOADS}/`,
        }],
        existing: true,
      }
    },
  ],
};
