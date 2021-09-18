import 'source-map-support/register';

import { S3 } from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const s3 = new S3({ region: 'eu-west-1' });
  const fileName = event.queryStringParameters.name;
  const path = `uploads/${fileName}`;

  console.log(fileName);

  const s3params = {
    Bucket:  process.env.BUCKET,
    Key: path,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', s3params);
    console.log(url);
    return formatJSONResponse({
      url,
    });
  } catch (e) {
    console.log(e);
  }

  return formatJSONResponse({ event });
};

export const main = middyfy(importProductsFile);
