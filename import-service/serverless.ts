import type { AWS } from '@serverless/typescript';
import { importProductsFile, importFileParser } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BUCKET: '${env:BUCKET}',
      UPLOADS: 'uploads',
      PARSED: 'parsed',
      SQS_URL: "${cf:product-service-dev.QueueUrl}",
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: 'arn:aws:s3:::socks-shop-bucket',
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: `arn:aws:s3:::socks-shop-bucket/*`,
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: "${cf:product-service-dev.QueueArn}",
      },
    ],
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser }
};

module.exports = serverlessConfiguration;
