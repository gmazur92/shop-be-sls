import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from './apiGateway';
import { AppError } from './appError';
import MiddlewareFunction = middy.MiddlewareFunction;

export const apiGatewayResponseMiddleware = () => {

  const after: MiddlewareFunction<APIGatewayProxyEvent, any> = async (request) => {
    if (!request.event?.httpMethod || request.response === undefined || request.response === null) {
      return;
    }

    const existingKeys = Object.keys(request.response);
    const isHttpResponse = existingKeys.includes('statusCode')
      && existingKeys.includes('headers')
      && existingKeys.includes('body');

    if (isHttpResponse) {
      return;
    }

    request.response = formatJSONResponse(request.response);
  }

  const onError: MiddlewareFunction<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    const VALIDATION_ERROR = 'Event object failed validation'
    const blame = {};
    const { error } = request;
    const errorResponse = { message: error.message }
    let statusCode = 500;

    if (error instanceof AppError) {
      statusCode = error.statusCode;
    }

    if (error.message === VALIDATION_ERROR) {
      const details = (error as any).details
      statusCode = 400;

      for (const detail of details) {
        if (detail.params.missingProperty) {
          const { missingProperty } = detail.params
          blame[missingProperty] = detail.message
        } else {
          const name = detail.instancePath?.split('/')[2]
          blame[name] = detail.message
        }
      }
    }

    if (error.message === VALIDATION_ERROR) {
      request.response = formatJSONResponse({ ...errorResponse, blame }, statusCode);
    } else {
      request.response = formatJSONResponse(errorResponse, statusCode);
    }
  }

  return {
    after,
    onError,
  };
}
