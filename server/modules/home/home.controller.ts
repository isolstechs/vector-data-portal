import { Controller, Post, Body } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateCallRecord } from './dto/create-call-record.dto';
import { IDate } from '../interfaces/date.interaface';
import { IPrefixList } from '../interfaces/prefix-list.interface';

@Controller('home')
export class HomeController {
  constructor(private readonly _homeService: HomeService) {}

  @Post('create-call-records')
  async create(@Body() _createCallrecords: CreateCallRecord[]) {
    return await this._homeService.create(_createCallrecords);
  }

  @Post('get-call-records')
  async findAll(@Body() _date: IDate) {
    return await this._homeService.findAll(_date);
  }

  @Post('create-prefixes')
  async createPrefix(@Body() _prefixData: IPrefixList[]) {
    return await this._homeService.createPrefix(_prefixData);
  }
}
