import { AppError } from '@libs/appError';
import productRepository from './product.repository';

export default class ProductService {
  static async getById(productId: string) {
    const product = await productRepository.getById(productId);
    if (!product) {
      throw new AppError(`Product with id ${productId} is not found`);
    }
    return product;
  }

  static async get() {
    return await productRepository.get();
  }

  static async create(product) {
    const { id } = await productRepository.create(product);
    return this.getById(id);
  }
}
