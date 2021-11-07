import axios, { Method, AxiosRequestConfig } from 'axios';
import { HttpStatus, CACHE_MANAGER, Injectable, Logger, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  private readonly logger = new Logger(AppService.name);

  getRedirectPath(originalUrl: string) {

    this.logger.log(`originalUrl: ${originalUrl}`);
    let service = originalUrl.split('/')[ 1 ];
    this.logger.log(`service: ${service}`);
    let params = originalUrl.split('/')[ 2 ];

    if (!service || !process.env[ service ]) {
      this.logger.warn(`${service} not found`);
      return { url: null, service };
    }

    let path = process.env[ service ];

    if (params) {
      path = `${path}/${params}`;
    }

    return { url: path, service };
  }

  async sendRequest(url: string, service: string, method: string, data: Record<string, any> = {}) {

    if (service === 'products' && method === 'GET') {
      const products = await this.cacheManager.get('products');
      if (products) {
        return { status: HttpStatus.OK, data: products };
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      url,
      method: method as Method,
    };
    if (Object.keys(data).length) {
      axiosConfig.data = data;
    }

    try {
      const { status, data } = await axios(axiosConfig);

      if (service === 'products' && method === 'GET') {
        await this.cacheManager.set('products', data, { ttl: 120 });
      }
      return { status, data };
    } catch (e) {
      return { status: e.response.status, data: e.response.data };
    }
  }
}
