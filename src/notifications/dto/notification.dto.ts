import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class FCMTokensDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    oldFCMToken: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    newFCMToken: string;
}

export class OrderNotificationDto{

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    orderId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string;


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    message: string;

 

}