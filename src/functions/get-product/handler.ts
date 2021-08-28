import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { ProductService } from '../../resources/productService';
import { Product } from '../../types';

const getProductsById = async (event) => {
  const {productId} = event.pathParameters;
    const product: Product = await ProductService.getById(productId);
    return formatJSONResponse({
      product,
    });
};

export const main = middyfy(getProductsById);
