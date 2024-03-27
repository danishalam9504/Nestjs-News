import { IsString, IsUrl, IsArray, IsDate, IsIn, IsOptional, IsNotEmpty, IsNumber, IsDecimal } from 'class-validator';
export class NewsDto{

  @IsNotEmpty() // ensures the id is not empty
  @IsString()
  id: string;
  
  @IsNotEmpty() // ensures the title is not empty
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  title_en: string;
  
  @IsUrl()
  link: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  creator: string[];

  @IsOptional()
  @IsString()
  video_url: string;

  @IsNotEmpty()  // ensures the description is not empty
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  description_en: string;

  @IsNotEmpty()  // ensures the content is not empty
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  content_en: string;

  @IsNotEmpty() // ensures the published_date is not empty
  @IsNumber()
  published_date: number;

  @IsOptional() 
  @IsString()
  image_url: string;

  @IsOptional()
  @IsString()
  article_source: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  country: string[];

  @IsArray()
  @IsString({ each: true })// Making category optional as it can be an empty array
  category: string[];
  
  @IsOptional()
  @IsString()
  language: string | null;

  @IsOptional()
  @IsNumber()
  sentiment:number | null;

  @IsString() // Assuming 'Mobile' is the only allowed source
  source: string;

}
