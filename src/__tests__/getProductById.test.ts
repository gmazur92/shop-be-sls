import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
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
      expect(e.message).toEqual('Product with 7567ec4b-b10c-48c5-9345-fc73c48a80a is not found')
      expect(e.statusCode).toBe(404);
    }
  });

  it('should return product object and statusCode 200', async () => {
    const event = {
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a0'
      }
    } as any;
    const actual = await main(event);
    expect(actual).toEqual({
        "count":6,
        "description":"A sock is a piece of clothing worn on the feet and often covering the ankle or some part of the calf.",
        "id":"7567ec4b-b10c-48c5-9345-fc73c48a80a0",
        "price":10,
        "title":"Organic",
        "img":"https://dodosocks.com/wp-content/uploads/2020/12/gus_02.jpg"
    });
  });
});
