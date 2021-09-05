import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { products }  from '../../products'
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
    expect(actual).toEqual({
      products
    });
  });
});
