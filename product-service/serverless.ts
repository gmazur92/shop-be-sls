import type { AWS } from '@serverless/typescript';

import { getProductsById, getProductsList, createProduct, catalogBatchProcess } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      DB_PORT: '${env:DB_PORT}',
      DB_NAME: '${env:DB_NAME}',
      DB_USER: '${env:DB_USER}',
      DB_PASSWORD: '${env:DB_PASSWORD}',
      DB_HOST: '${env:DB_HOST}',
      PRIMARY_EMAIL: '${env:PRIMARY_EMAIL}',
      SECONDARY_EMAIL: '${env:SECONDARY_EMAIL}',
      SQS_URL: {
        Ref: 'catalogItemsQueue',
      },
      SNS_ARN: {
        Ref: 'createProductTopic',
      },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [
          { Ref: 'createProductTopic' },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        ],
      },
    ],
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'shop-queue',
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'sqs-create-topic',
        },
      },
      createProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:PRIMARY_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            price: [
              {
                numeric: ['<=', 10],
              },
            ],
          },
        },
      },
      expensiveProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:SECONDARY_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            price: [
              {
                numeric: ['>', 10],
              },
            ],
          },
        },
      },
    },
    Outputs: {
      QueueUrl: {
        Value: {
          Ref: 'catalogItemsQueue',
        },
      },
      QueueArn: {
        Value: {
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
        },
      },
    },
  },
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
