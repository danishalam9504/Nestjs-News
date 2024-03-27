import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDto } from './dto/news.dto';
import { SearchDto } from './dto/search.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config'; 


@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService,private readonly configService: ConfigService ) { }

  index = 'news';
  query: any;

  @Post('search')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FilesInterceptor('files'))
  async searchByKey(@Req() req: Request) {
    const contentType = req.headers['content-type'];
    const formData = req.body; // This will contain the form data fields
    let { search_value, search_key, sort_by, sort_by_key, country, category, creator, language, article_source, lt_pub_date, size, start_date, end_date} = formData;
    if (contentType.includes('multipart/form-data')) {
      search_key = search_key.split(',');
      country = country ? country.split(',') : [];
      category = category ? category.split(',') : [];
      creator = creator ? creator.split(',') : [];
      language = language ? language.split(',') : [];
      article_source = article_source ? article_source.split(',') : [];
      lt_pub_date = +lt_pub_date;
      size = +size;
      start_date = +start_date;
      end_date = +end_date;
    }

      let filter = [];
      let must :any=[];

      

      // Check if search_value is null, undefined, or an empty string
      // if (!search_value || search_value.trim() === "") {
      //   if(lt_pub_date !== 0){
      //     must = [{
      //         "match_all": {},
      //       },{ "range": {
      //         "published_date": {
      //           "lt": lt_pub_date  // This should be the provided published_date value
      //         }
      //       }
      //     }];
      //   }else{
      //     must = [{
      //         "match_all": {},
      //       }];
      //   }
      // } else {
      //   if(lt_pub_date !== 0){
      //     must = [{
      //       "multi_match": {
      //         "query": search_value,
      //         "fields": search_key
      //       }
      //     },{
      //       "range": {
      //         "published_date": {
      //           "lt": lt_pub_date  // This should be the provided published_date value
      //         }
      //       }
      //     }];
      //   }else{
      //     must = [{
      //       "multi_match": {
      //         "query": search_value,
      //         "fields": search_key
      //       }
      //     }];
      //   }
      // }

      if (!search_value || search_value.trim() === "") {
        must = [{
            "match_all": {},
          }];
      } else {
        must = [{
          "multi_match": {
            "query": search_value,
            "fields": search_key
          }
        }];
      }

      if(lt_pub_date !== 0){
        must.push({
          "range": {
            "published_date": {
              "lt": lt_pub_date  // This should be the provided published_date value
            }
          }
        })
      }

      if(start_date && end_date){
        must.push({
          "range": {
            "published_date": {
              "gte": start_date,
              "lte": end_date// This should be the provided published_date value
            }
          }
        })
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
        "size": size,
        "track_total_hits": true
      }
      // console.log(this.query);
      // console.log(must);
      const EsData = await this.newsService.executeQuery(this.index, this.query);
      const extractedData = this.newsService.extractRequiredFields(EsData);
      const count = EsData['hits']['hits'].length;
      const totalCount = EsData['hits']['total']['value'];

      return {
        status: "ok",
        data: extractedData,
        size: count,
        totalCount
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

    const result = await this.newsService.create(this.index, data);

    if(result){
      let message=`News ${result['result']} successfully`;
      return {
        status: "ok",
        news_id: result['_id'],
        message
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Req() req: Request) {
    const authToken = req.headers['auth-token'];
    const authSecret = this.configService.get<string>('AUTH_SECRET');

    if (!authToken || authToken !== authSecret) {
      throw new BadRequestException('Invalid Auth-token');
    }
  
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
