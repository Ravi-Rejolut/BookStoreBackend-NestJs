import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, PaymentSatatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationDto } from "src/constants/dto";

export class CreateOrderDto{


    @IsUUID()
    @IsNotEmpty()
    @ApiProperty()
    shippingId:string

}
export class UpdateOrderStatus{


    @IsEnum(OrderStatus)
    @IsNotEmpty()
    @ApiProperty()
    orderStatus:OrderStatus

}




export class OrderFetchDto extends PaginationDto{

    @IsString()
    @IsOptional()
    @ApiProperty()
    search:string

    @IsEnum(OrderStatus)
    @IsOptional()
    @ApiProperty()
    orderStatus:OrderStatus


    @IsEnum(PaymentSatatus)
    @IsOptional()
    @ApiProperty()
    paymentStatus:PaymentSatatus


}