import 'source-map-support/register';
import { S3Event } from 'aws-lambda';

import { S3 } from 'aws-sdk';
import csv from 'csv-parser';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const importFileParser = async (event: S3Event) => {
  console.log('Parser started.');
  const s3 = new S3({ region: 'eu-west-1' });
  const Bucket = 'socks-shop-bucket';

  try {
    for (const record of event.Records) {
      const Key = record.s3.object.key;
      console.log(`Reading file: ${Key}`);
      const s3Stream = s3.getObject({ Bucket, Key }).createReadStream();
      s3Stream
        .pipe(csv())
        .on('data', console.log)
        .on('error', err => {
          throw new Error(`Reading failed: ${err}`);
        })
        .on('end', async () => {
          console.log('Reading completed.');
          console.log(`Replacing file...`);
          await s3.copyObject({
            Bucket,
            CopySource: `${Bucket}/${Key}`,
            Key: Key.replace('uploads', 'parsed'),
          }).promise();
          await s3.deleteObject({
            Bucket,
            Key,
          }).promise();
          console.log('File has been successfully replaced into parsed folder');
        });
    }

    return formatJSONResponse({ success: true });
  } catch (e) {
    throw new Error(e);
  }
};

export const main = middyfy(importFileParser);
