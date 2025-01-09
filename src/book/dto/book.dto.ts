import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty()
    @IsString()
    name: string

}

export class CreateBookDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    rating: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number


    @IsNotEmpty()
    @IsBoolean()
    available: boolean

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsNotEmpty()
    @IsString()
    description: string

    @IsUUID()
    @IsNotEmpty()
    authorId:string

    @IsUUID()
    @IsNotEmpty()
    categoryId:string

    
  
}
export class UpdateBookDto {

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name: string

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    rating: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price: number


    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    available: boolean

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    quantity: number

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    description: string

    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    authorId:string

    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    categoryId:string

    
  
}

export class CreateAuthorDto{

    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    description:string
}


export class BookFetchDto{

    @IsString()
    @IsOptional()
    category:string

    @IsString()
    @IsOptional()
    author:string

    @IsNumber()
    @IsOptional()
    rating:number

    @IsNumber()
    @IsOptional()
    price:number

    @IsNumber()
    @IsOptional()
    search:string

    @IsBoolean()
    @IsOptional()
    available:boolean
}