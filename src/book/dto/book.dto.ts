import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { PaginationDto } from "src/constants/dto";

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
    @Transform(val => parseInt(val.value, 10))
    rating: number

    @IsNotEmpty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsPositive()
    price: number


    @IsNotEmpty()
    @IsBoolean()
    @Transform(val => Boolean(val.value))
    available: boolean

    @IsNotEmpty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    quantity: number

    @IsNotEmpty()
    @IsString()
    description: string

    @IsUUID()
    @IsNotEmpty()
    authorId: string

    @IsUUID()
    @IsNotEmpty()
    categoryId: string



}
export class UpdateBookDto {

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name: string

    @IsNotEmpty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    rating: number

    @IsNotEmpty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsPositive()
    @IsOptional()
    price: number


    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    available: boolean

    @IsNotEmpty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    quantity: number

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    description: string

    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    authorId: string

    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    categoryId: string



}

export class CreateAuthorDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string
}


export class BookFetchDto extends PaginationDto {

    @IsString()
    @IsOptional()
    category: string

    @IsString()
    @IsOptional()
    author: string

    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    rating: number

    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    price: number

    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    search: string

    @IsBoolean()
    @IsOptional()
    available: boolean


}