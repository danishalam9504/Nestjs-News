import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NewsService {
    private news = [];

    findAll() {
        return this.news;
    }

    findOne(id: number) {
        const newsItem = this.news.find(item => item.id === +id); // Convert id to number
        if (!newsItem) {
            throw new NotFoundException(`News with id ${id} not found`);
        }
        return newsItem;
    }

    create(data: any | any[]) {
        if (Array.isArray(data)) {
            // If data is an array, push each item individually
            data.forEach(item => {
                this.news.push(item);
            });
        } else {
            // If data is not an array, push it as a single item
            this.news.push(data);
        }
        return data;
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

    findByQuery(query: { [key: string]: string }) {
        const filteredNews = this.news.filter(item => {
          return Object.keys(query).every(key => {
            const queryValue = query[key].toLowerCase();
            const itemValue = item[key]?.toLowerCase(); // Use optional chaining for cases where item[key] is undefined
            return itemValue.includes(queryValue);
          });
        });
    
        if (filteredNews.length === 0) {
          throw new NotFoundException(`News with specified query parameters not found`);
        }
    
        return filteredNews;
      }
}
