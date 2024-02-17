import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDto } from './dto/news.dto';
import { SearchDto } from './dto/search.dto';
import { truncate } from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';


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
    return this.newsService.executeQuery(this.index, this.query);
  }

  @Post('search')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FilesInterceptor('files'))
  async searchByKey(@Req() req: Request) {
    const contentType = req.headers['content-type'];
    const formData = req.body; // This will contain the form data fields
    let { search_value, search_key, sort_by, sort_by_key, country, category, creator, language, article_source, from, size } = formData;
    if (contentType.includes('multipart/form-data')) {
      search_key = search_key.split(',');
      country = country.split(',');
      category = category.split(','); article_source
      creator = creator.split(',');
      language = language.split(',');
      article_source = article_source.split(',');
      from = +from;
      size = +size;
    }

      let filter = [];
      let must: any;

      // Check if search_value is null, undefined, or an empty string
      if (!search_value || search_value.trim() === "") {
        must = {
          "match_all": {}
        };
      } else {
        must = {
          "multi_match": {
            "query": search_value,
            "fields": search_key
          }
        };
      }

      // Function to add terms to filter if array is not empty
      const addTermsToFilter = async (field: string, values: any) => {
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

      this.query = {
        "query": {
          "bool": {
            "must": must,
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
      const EsData = await this.newsService.executeQuery(this.index, this.query);
      const extractedData = this.newsService.extractRequiredFields(EsData);
      const count = EsData['hits']['hits'].length;

      return {
        status: "ok",
        data: extractedData,
        size: count
      };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    this.query = this.newsService.queryForSingleNewsValue(id);
    const EsData = await this.newsService.executeQuery(this.index, this.query);
    const extractedData = this.newsService.extractRequiredFields(EsData);

    return {
      status: "ok",
      data: extractedData
    };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() data: NewsDto) {

    this.query = this.newsService.queryForSingleNewsValue(data['id']);
    const EsData = await this.newsService.executeQuery(this.index, this.query);
    const hits = EsData['hits']['hits'];
    data['created_at'] = hits.length ? hits[0]['_source']['created_at'] : new Date().getTime();
    data['updated_at'] = new Date().getTime();

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
    this.query = {
      "query": {
        "match": {
          "_id": id
        }
      }
    }
    return this.newsService.remove(this.index, this.query);
  }
}
