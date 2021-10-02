import 'source-map-support/register';
import { S3Event } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';
import { writeLog } from '@libs/logger';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { BUCKET, UPLOADS, PARSED } from '../../config/config';

const importFileParser = async (event: S3Event) => {
  writeLog('Parser started.');
  const s3 = new S3({ region: 'eu-west-1' });
  const sqs = new SQS();
  const Bucket = BUCKET;
  try {
    for (const record of event.Records) {
      const Key = record.s3.object.key;
      writeLog(`Reading file: ${Key}`);
      const s3Stream = s3.getObject({ Bucket, Key }).createReadStream();
      s3Stream
        .pipe(csv())
        .on('data', (chunk) => {
            sqs.sendMessage(
              {
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(chunk),
              },
              (error) => {
                writeLog(`ERROR: ${error}`)
                writeLog(`Added to queue: ${chunk}`);
              }
            );
        })
        .on('error', err => {
          throw new Error(`Reading failed: ${err}`);
        })
        .on('end', async () => {
          writeLog('Reading completed.');
          writeLog(`Replacing file...`);
          await s3.copyObject({
            Bucket,
            CopySource: `${Bucket}/${Key}`,
            Key: Key.replace(`${UPLOADS}`, `${PARSED}`),
          }).promise();
          await s3.deleteObject({
            Bucket,
            Key,
          }).promise();
          writeLog('File has been successfully replaced into parsed folder');
        });
    }

    return formatJSONResponse({ success: true });
  } catch (e) {
    throw new Error(e);
  }
};

export const main = middyfy(importFileParser);
