import 'source-map-support/register';

import { S3 } from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { BUCKET, UPLOADS } from '../../config/config';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const s3 = new S3({ region: 'eu-west-1' });

  if (!event.queryStringParameters || !event.queryStringParameters.name) {
    throw new Error('File name is required');
  }

  const { name } = event.queryStringParameters;
  const path = `${UPLOADS}/${name}`;

  const s3params = {
    Bucket: BUCKET,
    Key: path,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', s3params);
    return formatJSONResponse({ url });
  } catch (e) {
    throw new Error(e);
  }
};

export const main = middyfy(importProductsFile);
