import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';
import { middyfy } from '../libs/lambda';
jest.mock('@libs/lambda');

describe('getProducts handler', () => {
  let main;
  let mockedMiddyfy: jest.MockedFunction<typeof middyfy>;

  beforeEach(async () => {
    mockedMiddyfy = mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });
    main = (await import('../functions/get-products-list/handler')).main;
  });

  it('should return an array of products', async () => {
    const actual = await main();
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "count": 1, "description": "description8", "id": "0cbc41b4-3e45-4633-a93a-9c6b1dd26eed", "price": 8, "title": "title8"
        })
      ])
    )
  });
});
