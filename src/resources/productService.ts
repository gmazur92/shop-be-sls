import { products } from '../../products.js';
import { Product } from '../types';

export class ProductService {
  static async getById(productId: string): Promise<Product> {
    const product: Product = products.find(({id}) => id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async get(): Promise<Product[]> {
    return products;
  }
}
