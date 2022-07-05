import { Controller, Post, Body } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateCallRecord } from './dto/create-call-record.dto';
import { IDate } from '../interfaces/date.interaface';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post('create-call-records')
  async create(@Body() _createCallrecords: CreateCallRecord[]) {
    return await this.homeService.create(_createCallrecords);
  }

  @Post('get-call-records')
  async findAll(@Body() _date: IDate) {
    return await this.homeService.findAll(_date);
  }
}
