import { IsEnum, IsNotEmpty, IsString, IsUUID,  } from "class-validator";

export enum TOKEN_TYPE{
    LOGIN='LOGIN'
}

export class createTokenDto{

    @IsString()
    @IsUUID()
    @IsNotEmpty()
    id:string


    @IsNotEmpty()
    @IsString()
    @IsEnum(TOKEN_TYPE)
    tokenType:TOKEN_TYPE
}

