import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports:[
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'https://0c14973a18374052b6ddb3bb0ff51584.us-central1.gcp.cloud.es.io:443',
        auth: {
          apiKey: 'S2Ywb2ZZd0JzNnd3VERsam1jamo6dUoxWUdqNkZSSGltZE5BVDktM0ZZZw==',
        },
      }),
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
