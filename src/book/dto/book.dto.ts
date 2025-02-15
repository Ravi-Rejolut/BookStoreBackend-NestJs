import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { PaginationDto } from "src/constants/dto";

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

}

export class CreateBookDto {

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    name: string

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    rating: number

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsPositive()
    price: number


    @IsNotEmpty()
    @ApiProperty()
    @IsBoolean()
    @Transform(val => Boolean(val.value))
    available: boolean

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    quantity: number

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    description: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    authorId: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    categoryId: string



}
export class UpdateBookDto {

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    rating: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    @Transform(val => parseInt(val.value, 10))
    @IsPositive()
    @IsOptional()
    price: number


    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    @IsOptional()
    available: boolean

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    quantity: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @IsOptional()
    description: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    authorId: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    categoryId: string



}

export class CreateAuthorDto {

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    description: string
}


export class BookFetchDto extends PaginationDto {

    @IsString()
    @ApiProperty()
    @IsOptional()
    category: string

    @IsString()
    @ApiProperty()
    @IsOptional()
    author: string

    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    @ApiProperty()
    rating: number

    @IsNumber()
    @ApiProperty()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    price: number

    @IsNumber()
    @Transform(val => parseInt(val.value, 10))
    @IsOptional()
    @ApiProperty()
    search: string

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    available: boolean


}