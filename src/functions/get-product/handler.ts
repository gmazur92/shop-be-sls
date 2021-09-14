import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import productService from '../../resources/product.service';

const getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  return await productService.getById(productId);
};

export const main = middyfy(getProductsById);
