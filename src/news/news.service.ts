import { Injectable, NotFoundException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { NewsDto } from './dto/news.dto';
@Injectable()
export class NewsService {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }
    private news = [];

    async searchFromES(index: string, body: any): Promise<any> {
        return this.elasticsearchService.search({
            index
        });
    }

    findAll(index: string, body: any) {
        return this.elasticsearchService.search({
            index,
            body
        });
    }

    findOne(id: number) {
        const newsItem = this.news.find(item => item.id === +id); // Convert id to number
        if (!newsItem) {
            throw new NotFoundException(`News with id ${id} not found`);
        }
        return newsItem;
    }

    create(index: string, data: NewsDto) {
        const indexId = data['id'];
        delete data['id'];
        return this.elasticsearchService.index({
            index,
            id:indexId,
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

    remove(id: string) {
        const index = this.news.findIndex(item => item.id === +id);
        if (index !== -1) {
            const removedItem = this.news[index];
            this.news.splice(index, 1);
            return removedItem;
        } else {
            throw new NotFoundException(`News with id ${id} not found`);
        }
    }

    searchByQuery(query: { [key: string]: string }) {
        
        // const filteredNews = this.news.filter(item => {
        //     return Object.keys(query).every(key => {
        //         const queryValue = query[key].toLowerCase();
        //         const itemValue = item[key]?.toLowerCase(); // Use optional chaining for cases where item[key] is undefined
        //         return itemValue.includes(queryValue);
        //     });
        // });

        // if (filteredNews.length === 0) {
        //     throw new NotFoundException(`News with specified query parameters not found`);
        // }

        // return filteredNews;
    }
}
