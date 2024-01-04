import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDto } from './dto/news.dto';
import { SearchDto } from './dto/search.dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) { }

  index = 'news';
  query: any;
  @Get()
  findAll() {
    this.query = {
      query: {
        match_all: {},
      },
      sort: [
        {
          "published_date": {
            order: "desc"
          }
        }
      ],
    };
    return this.newsService.findAll(this.index, this.query);
  }

  @Post('search')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  searchByKey(@Body() data: SearchDto) {
    const { search_value,search_key,sort_by,sort_by_key,from,size,country,category,creator,language,article_source} = data;

    let filter = [];

    // Function to add terms to filter if array is not empty
    const addTermsToFilter = (field:string, values:any) => {
        if (values && values.length > 0) {
            filter.push({
                terms: {
                    [`${field}.keyword`]: values
                }
            });
        }
    };
    
    // Add terms to filter based on non-empty arrays
    addTermsToFilter('country', country);
    addTermsToFilter('category', category);
    addTermsToFilter('creator', creator);
    addTermsToFilter('language', language);
    addTermsToFilter('article_source', article_source);

    this.query ={
      "query": {
        "bool": {
          "must": {
            "multi_match": {
              "query": search_value,
              "fields": search_key
            }
          },
          "filter": filter
        }
      },
      "sort": [
        {
          [sort_by_key]: {
            "order": sort_by
          }
        }
      ],
      "from": from,
      "size": size
    }
    return this.newsService.findAll(this.index, this.query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.query = {
      "query": {
        "match": {
          "_id": `${id}`
        }
      }
    }
    return this.newsService.findAll(this.index, this.query);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() data: NewsDto) {
    return this.newsService.create(this.index, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.newsService.update(id, data);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() data: any) {
    return this.newsService.partialUpdate(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
