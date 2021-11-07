import { Controller, Req, Res, HttpException, HttpStatus, All } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  async redirect(@Req() req: Request, @Res() res: Response): Promise<any> {
    const { url, service } = this.appService.getRedirectPath(req.url);

    if (!url) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }

    const result = await this.appService.sendRequest(url, service, req.method, req.body);
    return res.status(result.status).json(result.data);
  }
}
