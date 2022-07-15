import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-countries')
  async getCountries(): Promise<any> {
    return await this.appService.getCountries();
  }

  @Get('get-operators')
  async getOperators(): Promise<any> {
    return await this.appService.getOperators();
  }

  @Get('get-prefixes')
  async getPrefixes(): Promise<any> {
    return await this.appService.getPrefixes();
  }
}
