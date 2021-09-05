import productRepository from './product.repository';

export default class ProductService {
  static async getById(productId: string) {
    return await productRepository.getById(productId);
  }

  static async get() {
    return await productRepository.get();
  }

  static async create(product) {
    const { id } = await productRepository.create(product);
    return this.getById(id);
  }
}
