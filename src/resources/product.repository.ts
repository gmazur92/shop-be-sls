import { AppError } from '@libs/appError';
import dbConfig from '@libs/dbConfig';
import { Client } from 'pg';

export default class ProductRepository {

  static async client() {
    const client = new Client(dbConfig);
    await client.connect();
    return client;
  }

  static async getById(id: string) {
    const client = await this.client();

    try {
      const { rows: data } = await client.query(
        'SELECT p.id, p.title, p.description, p.price, s.count FROM products p INNER JOIN' +
        ' stocks s ON p.id = s.product_id WHERE p.id = $1', [id]);
      return data[0];
    } catch (e) {
      throw new AppError(e.message, 500);
    } finally {
      client.end();
    }
  }

  static async get() {
    const client = await this.client();

    try {
      const { rows: data } = await client.query(
        'SELECT p.id, p.title, p.description, p.price, s.count FROM products p INNER JOIN stocks s ON p.id = s.product_id');
      return data;
    } catch (e) {
      throw new AppError(e.message, 500);
    } finally {
      client.end();
    }
  }

  static async create(product) {
    const client = await this.client();
    const { title, description, price, count } = product;

    try {
      await client.query('BEGIN');
      const { rows: data } = await client.query(
        'INSERT INTO products(title, description, price)' +
        ' VALUES ($1, $2, $3) RETURNING id', [title, description, price]);
      const { id } = data[ 0 ];
      await client.query('INSERT INTO stocks (product_id, count) VALUES ($1, $2)',
        [id, count]);
      await client.query('COMMIT');
      return data[ 0 ];
    } catch (e) {
      await client.query('ROLLBACK');
      throw new AppError(e.message, 500);
    } finally {
      client.end();
    }
  }
}
