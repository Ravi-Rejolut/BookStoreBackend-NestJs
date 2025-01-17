import { Role } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { PaginationDto } from "src/constants/dto";
import { Cart ,CartItem} from "@prisma/client";

export class CartDto {

    @IsUUID()
    @IsNotEmpty()
    bookId: string


    @IsInt()
    @IsOptional()
    quantity: number = 1


}

export class UserFetchDto extends PaginationDto {

    @IsString()
    @IsOptional()
    search: string

    @IsEnum(Role)
    @IsOptional()
    role: Role = Role.USER
}


export class AddressDto {

    @IsString()
    @IsNotEmpty()
    address1: string

    @IsString()
    @IsNotEmpty()
    address2: string

    @IsString()
    @IsNotEmpty()
    city: string

    @IsString()
    @IsNotEmpty()
    state: string


    @IsString()
    @IsNotEmpty()
    country: string


    @IsString()
    @IsNotEmpty()
    postalCode: string

}


export interface cartWithCartItem extends Cart{

    CartItem:CartItem[]
}