import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-countries')
  getCountries(): any {
    return this.appService.getCountries();
  }
}
