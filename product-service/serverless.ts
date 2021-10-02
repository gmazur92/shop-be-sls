import type { AWS } from '@serverless/typescript';

import {getProductsById,getProductsList, createProduct} from './src/functions'

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
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
      DB_PORT: '',
      DB_NAME: '',
      DB_USER: '',
      DB_PASSWORD: '',
      DB_HOST: '',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { getProductsList, getProductsById, createProduct }
}

module.exports = serverlessConfiguration
