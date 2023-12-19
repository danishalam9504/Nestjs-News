import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDto } from './dto/news.dto';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }
   
  @Get()
  findAll() {
    const index = 'student';
    const query = {
      query: {
        match_all: {}, // Replace with your Elasticsearch query
      },
      sort: [
        {
          "page_count": {
            order: "desc"
          }
        }
      ], 
    };
    return this.newsService.findAll(index,query);
  }

  @Get('search')
  searchByKey(@Query() query: { [key: string]: string }) {
    if (Object.keys(query).length > 0) {
      return this.newsService.findByQuery(query);
    } else {
      // return this.newsService.findAll();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.newsService.findOne(id);
  }

  @Post()
  create(@Body() data: NewsDto) {
    const index='student';
    return this.newsService.create(index,data);
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
