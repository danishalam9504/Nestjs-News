import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule], // Import the ConfigModule
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
        auth: {
          apiKey: configService.get<string>('ELASTICSEARCH_API_KEY'),
        },
      }),
      inject: [ConfigService], // Inject ConfigService into useFactory
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
