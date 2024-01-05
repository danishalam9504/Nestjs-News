import { IsNotEmpty, IsString, IsArray, IsIn, IsInt, Min } from 'class-validator';

export class SearchDto {
  
  // @IsNotEmpty()
  @IsString()
  search_value: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  search_key: string[];

  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  sort_by: 'asc' | 'desc';

  @IsNotEmpty()
  @IsString()
  sort_by_key: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  from: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  size: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  country: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  creator: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  language: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  article_source: string[];
}
