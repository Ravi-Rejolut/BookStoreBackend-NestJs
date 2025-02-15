import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';



export class signupDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;
}

export class loginDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;


}