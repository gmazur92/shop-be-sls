import 'source-map-support/register';
import { middyfy } from '@libs/lambda';

import { ProductService } from '../../resources/productService';
import { Product } from '../../types';

const getProductsList = async () => {
  const products: Product[] = await ProductService.get();
  return {
    products,
  };
};

export const main = middyfy(getProductsList);
