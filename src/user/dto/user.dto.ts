import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CartDto{

    @IsUUID()
    @IsNotEmpty()
    bookId:string


    @IsInt()
    @IsOptional()
    quantity:number=1


}

