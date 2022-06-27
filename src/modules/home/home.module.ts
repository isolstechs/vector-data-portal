import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { HomeProviders } from './home.provider';

@Module({
  controllers: [HomeController],
  providers: [HomeService, ...HomeProviders],
})
export class HomeModule {}
