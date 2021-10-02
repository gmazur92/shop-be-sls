import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
jest.mock('@libs/lambda');

describe('Import product handler', () => {
  let main;
  let mockedMiddyfy: jest.MockedFunction<typeof middyfy>;

  beforeEach(async () => {
    process.env.BUCKET = 'test-bucket';
    process.env.UPLOADS = 'testFolder';
    mockedMiddyfy = mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });
    main = (await import('../functions/importProductsFile/handler')).main;
  });

  it('should generate signed link', async () => {
    const fileName = 'testFile'
    const event = {
      queryStringParameters: {
        name: fileName
      }
    } as any;
      const actual = await main(event);
      expect(JSON.parse(actual.body)).toEqual(expect.objectContaining({
        url: expect.stringContaining(`https://${process.env.BUCKET}.s3.eu-west-1.amazonaws.com/${process.env.UPLOADS}/${fileName}`)
      }))
  });

  it('should return error message', async () => {
    const event = {
      queryStringParameters: {
        test: 'test'
      }
    } as any;
    try {
      await main(event);
    } catch (e) {
      expect(e.message).toEqual('File name is required')
    }
  });
});
