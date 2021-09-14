import 'source-map-support/register';
import { middyfy } from '../../libs/lambda';
import middy from '@middy/core';
import validator from '@middy/validator';
import productService from '../../resources/product.service';
import { productSchema as inputSchema } from './schema';

const createProduct = middy(async (event) => {
  return await productService.create(event.body);
});

export const main = middyfy(createProduct)
  .use(validator({ inputSchema }));
