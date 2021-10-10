import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';
import { middyfy } from '../libs/lambda';
jest.mock('@libs/lambda');

describe('getProductById handler', () => {
  let main;
  let mockedMiddyfy: jest.MockedFunction<typeof middyfy>;

  beforeEach(async () => {
    mockedMiddyfy = mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });
    main = (await import('../functions/get-product/handler')).main;
  });

  it('should return 404 error', async () => {
    const event = {
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a'
      }
    } as any;
    expect.assertions(2);
    try {
      await main(event);
    } catch (e) {
      expect(e.message).toEqual('Product with id 7567ec4b-b10c-48c5-9345-fc73c48a80a is not found')
      expect(e.statusCode).toBe(400);
    }
  });

  it('should return product object and statusCode 200', async () => {
    const event = {
      pathParameters: {
        productId: 'a2b954f4-bcb8-4400-822d-e00fbf88ab4b'
      }
    } as any;
    const actual = await main(event);
    expect(actual).toEqual({
        "count":6,
        "description":"description7",
        "id":"a2b954f4-bcb8-4400-822d-e00fbf88ab4b",
        "price":7,
        "title":"title7",
    });
  });
});
