import { products } from '../../products';
import { Product } from '../types';
import { AppError } from '@libs/appError';

export class ProductService {
  static async getById(productId: string): Promise<Product> {
    const product: Product = products.find(({id}) => id === productId);
    if (!product) {
      throw new AppError(`Product with ${productId} is not found`, 404);
    }
    return product;
  }

  static async get(): Promise<Product[]> {
    return products;
  }
}
