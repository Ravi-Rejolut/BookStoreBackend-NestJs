import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";


export class PageMetaData{
  
  readonly page:number;
  readonly take:number;
  readonly itemCount:number;
  readonly pageCount:number;
  readonly hasPreviousPage:boolean;
  readonly hasNextPage:boolean


  constructor({page,take,itemCount})
  {
    this.page=page;
    this.take=take;
    this.itemCount=itemCount;
    this.pageCount=Math.ceil(itemCount/take);
    this.hasPreviousPage=this.page>1;
    this.hasNextPage=this.page<this.pageCount
  }

  
}
export class PaginationDto {
    
    @IsEnum(Prisma.SortOrder)
    @IsOptional()
    orderBy: Prisma.SortOrder = Prisma.SortOrder.asc;

    @IsString()
    @IsOptional()
    sortBy:string
  
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;
  

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly take?: number = 10;
  
    get skip(): number {
      return (this.page - 1) * this.take;
    }

    get orderByObj(){
      return this.sortBy?{[this.sortBy]:this.orderBy}:{createdAt:Prisma.SortOrder.desc}
    }
  }
  

  export class serachQueryWithPagination extends PaginationDto{


    @IsString()
    @IsOptional()
    search:string
  }