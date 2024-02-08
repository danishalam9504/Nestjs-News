import { Injectable, NotFoundException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { NewsDto } from './dto/news.dto';
@Injectable()
export class NewsService {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }
    private news = [];

    // async searchFromES(index: string, body: any): Promise<any> {
    //     return this.elasticsearchService.search({
    //         index
    //     });
    // }

    queryForSingleNewsValue(id:string){
        return {
            "query": {
              "match": {
                "_id": `${id}`
              }
            }
          }
    }

    executeQuery(index: string, body: any) {
        return this.elasticsearchService.search({
            index,
            body
        });
    }

    create(index: string, data: NewsDto) {
        const indexId = data['id'];
        delete data['id'];
        return this.elasticsearchService.index({
            index,
            id: indexId,
            body: data
        });
    }

    update(id: string, data: any) {
        const index = this.news.findIndex(item => item.id === +id);
        if (index !== -1) {
            this.news[index] = { ...data, id: +id }; // Replace entire resource
            return this.news[index];
        } else {
            throw new NotFoundException(`News with id ${id} not found`);
        }
    }

    partialUpdate(id: string, data: any) {
        const index = this.news.findIndex(item => item.id === +id);
        if (index !== -1) {
            this.news[index] = { ...this.news[index], ...data }; // Partially update resource
            return this.news[index];
        } else {
            throw new NotFoundException(`News with id ${id} not found`);
        }
    }

    remove(index: string, query:any) {
        return this.elasticsearchService.deleteByQuery({
            index,
            body:query
        })
    }

    extractRequiredFields(jsonData:any) {
        const hits = jsonData.hits.hits;
      
        const extractedData = hits.map((hit:any) => {
          const source = hit._source;
          return {
            id: hit._id,
            title: source.title,
            keywords: source.keywords,
            creator: source.creator,
            video_url: source.video_url,
            image_url: source.image_url,
            description: source.description,
            content: source.content,
            published_date: source.published_date,
            country: source.country,
            category: source.category,
            created_at: source.created_at,
            updated_at: source.updated_at,
          };
        });

        return extractedData;
    }
}
