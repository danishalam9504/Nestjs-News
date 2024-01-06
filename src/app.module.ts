import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // specify the path to your .env file
      isGlobal: true,     // make the configuration module available globally
    }),
    NewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
