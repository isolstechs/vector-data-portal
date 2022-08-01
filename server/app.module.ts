import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';
import { AppServerModule } from '../src/main.server';
import { AppController } from './app.controller';
import { AppProviders } from './app.provider';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { HomeModule } from './modules/home/home.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { HomeProviders } from './modules/home/home.provider';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/vdp/browser'),
    }),
    DatabaseModule,
    HomeModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, TasksService, ...AppProviders, ...HomeProviders],
})
export class AppModule {}
