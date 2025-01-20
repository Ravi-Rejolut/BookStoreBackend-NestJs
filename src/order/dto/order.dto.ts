import { OrderStatus, PaymentSatatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationDto } from "src/constants/dto";

export class CreateOrderDto{


    @IsUUID()
    @IsNotEmpty()
    shippingId:string

}
export class UpdateOrderStatus{


    @IsEnum(OrderStatus)
    @IsNotEmpty()
    orderStatus:OrderStatus

}




export class OrderFetchDto extends PaginationDto{

    @IsString()
    @IsOptional()

    search:string

    @IsEnum(OrderStatus)
    @IsOptional()
    orderStatus:OrderStatus


    @IsEnum(PaymentSatatus)
    @IsOptional()
    paymentStatus:PaymentSatatus


}