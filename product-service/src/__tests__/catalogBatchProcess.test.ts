import { SNS } from 'aws-sdk';
import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';
import { middyfy } from '../libs/lambda';

jest.mock('@libs/lambda');
jest.mock('./../resources/product.service')
jest.mock('aws-sdk', () => ({
  SNS: jest.fn(() => ({ publish: jest.fn() })),
}));

const product = {"title":"t3","description":"d3","count":"3","price":"55"}

describe('catalogBatchProcess handler', () => {
  let main;
  let mockEvent;
  let mockedMiddyfy: jest.MockedFunction<typeof middyfy>;

  beforeEach(async () => {

    mockEvent = {
      Records: [{
        body: JSON.stringify(product),
      }]
    }

    mockedMiddyfy = mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });
    main = (await import('../functions/catalogBatchProcess/handler')).main;
  });

  it('should invoke function', async () => {
    await main(mockEvent);
    expect(SNS).toHaveBeenCalled();
  });

  it('should return success and statusCode 200', async () => {
    const actual = await main(mockEvent);
    expect(actual).toEqual({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      statusCode: 200,
      body: '{"success":true}'
    });
  });

  it('should call SNS method', async () => {
    await main(mockEvent);
    const mockPublish = SNS['mock'].results[0].value.publish;
    expect(mockPublish).toHaveBeenCalledWith({
      Subject: 'Subject',
      Message: JSON.stringify([product]),
      MessageAttributes: {
        price: {
          DataType: 'Number',
          StringValue: `${product.price}`
        }
      },
      TopicArn: process.env.SNS_ARN,
    },expect.any(Function));
  });

});
