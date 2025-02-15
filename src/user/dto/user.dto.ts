import { Role } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { PaginationDto } from "src/constants/dto";
import { Cart ,CartItem} from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CartDto {

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    bookId: string


    @IsInt()
    @IsOptional()
    @ApiProperty()
    quantity: number = 1


}

export class UserFetchDto extends PaginationDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    search: string

    @IsEnum(Role)
    @IsOptional()
    @ApiProperty()
    role: Role = Role.USER
}


export class AddressDto {

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    address1: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address2: string

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    city: string

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    state: string


    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    country: string


    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    postalCode: string

}


export interface cartWithCartItem extends Cart{

    CartItem:CartItem[]
}