import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './not-found-exception.filter';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // specify the path to your .env file
      isGlobal: true,     // make the configuration module available globally
    }),
    NewsModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule { }
