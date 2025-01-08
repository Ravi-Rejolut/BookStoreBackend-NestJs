import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty()
    @IsString()
    name: string

}

export class createBookDto {

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

    
  
}