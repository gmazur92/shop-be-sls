import { APIGatewayTokenAuthorizerHandler, PolicyDocument } from 'aws-lambda';
import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

const DENY = 'Deny';
const ALLOW = 'Allow';

const generatePolicy = (principalId: string, resource: string, effect = ALLOW) => {
  const policyDocument: PolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  };
  return { principalId, policyDocument };
};

const comparePassword = (name: string, password: string): string => {
  const secret = process.env[ name ];
  return !secret || secret !== password ? DENY : ALLOW;
};

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, _context, cb) => {
  if (event.type !== 'TOKEN') cb('Unauthorized');

  const { authorizationToken } = event;

  const encoded = authorizationToken.split(' ')[ 1 ];

  if (!encoded) cb('No token provided');

  try {
    const buffer = Buffer.from(encoded, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');
    const effect = comparePassword(username, password);
    const policy = generatePolicy(encoded, event.methodArn, effect);
    cb(null, policy);
  } catch (err) {
    cb(`Unauthorized`);
  }
};

export const main = middyfy(basicAuthorizer);
