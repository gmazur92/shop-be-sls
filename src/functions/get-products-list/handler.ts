import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import productService from '../../resources/product.service';

const getProductsList = async () => {
  return await productService.get();
};

export const main = middyfy(getProductsList);
