import { double } from '@elastic/elasticsearch/lib/api/types';
import { IsString, IsUrl, IsArray, IsDate, IsIn, IsOptional, IsNotEmpty, IsNumber, IsDecimal } from 'class-validator';

export class NewsDto{

  @IsNotEmpty() // ensures the id is not empty
  @IsString()
  id: string;
  
  @IsNotEmpty() // ensures the title is not empty
  @IsString()
  title: string;

  @IsNotEmpty() // ensures the title is not empty
  @IsString()
  title_en: string;
  
  @IsUrl()
  link: string;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsNotEmpty() // ensures the creator is not empty
  @IsArray()
  @IsString({ each: true })
  creator: string[];

  @IsUrl()
  video_url: string;

  @IsNotEmpty()  // ensures the description is not empty
  @IsString()
  description: string;

  @IsNotEmpty()  // ensures the description is not empty
  @IsString()
  description_en: string;

  @IsNotEmpty()  // ensures the content is not empty
  @IsString()
  content: string;

  @IsNotEmpty()  // ensures the content is not empty
  @IsString()
  content_en: string;

  @IsNotEmpty() // ensures the published_date is not empty
  @IsNumber()
  published_date: number;

  @IsUrl()
  image_url: string;

  @IsNotEmpty()
  @IsString()
  article_source: string;

  @IsArray()
  @IsString({ each: true })
  country: string[];

  @IsArray()
  @IsString({ each: true })// Making category optional as it can be an empty array
  category: string[];
  
  @IsString()
  language: string;

  @IsNumber()
  sentiment:number;

  @IsString() // Assuming 'Mobile' is the only allowed source
  source: string;


  @IsNotEmpty() // ensures the created_at is not empty
  @IsNumber()
  created_at: number;

  @IsNotEmpty() // ensures the created_at is not empty
  @IsNumber()
  updated_at: number;

}
