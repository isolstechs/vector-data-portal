import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [HomeModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
