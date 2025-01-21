import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class FCMTokensDto {

    @IsNotEmpty()
    @IsString()
    oldFCMToken: string;

    @IsNotEmpty()
    @IsString()
    newFCMToken: string;
}

export class OrderNotificationDto{

    @IsNotEmpty()
    @IsString()
    orderId: string;

    @IsNotEmpty()
    @IsString()
    title: string;


    @IsNotEmpty()
    @IsString()
    message: string;

 

}