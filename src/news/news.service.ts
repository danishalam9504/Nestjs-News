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
}
