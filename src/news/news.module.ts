import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports:[
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'https://6410070b697146d6972cc1af12c0d881.us-central1.gcp.cloud.es.io:443',
        auth: {
          apiKey: 'QUVySjFZd0JCa3F4RnpEVWIycGE6NlRrMlRVTW9SejZmUzRtY3UxSHEwZw==',
        },
      }),
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
