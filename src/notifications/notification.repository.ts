import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { OrderRepository } from "src/order/order.respository";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class NotificationRepository {

    constructor(private readonly prisma: PrismaService,private readonly orderRepository:OrderRepository) { }


    async getFCMToken(params: { where: Prisma.FCMTokenWhereUniqueInput }) {
        return await this.prisma.fCMToken.findFirst({ ...params });

    }

    async getFCMTokens(orderId:string)
    {
        const user= await this.orderRepository.getOrdersByOrderID({where:{id:orderId},select:{userId:true}});
        const fCMToken=await this.prisma.fCMToken.findMany({where:{userId:user.userId}});
        
        return fCMToken.map((tt)=>tt.token);
    }

    async setFCMToken(userId: string, token: string) {
        return await this.prisma.fCMToken.create({
            data:
            {
                token,
                User: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    async updateFCMToken(userId:string,token:string,newToken:string)
    {

        return await this.prisma.fCMToken.update({where:{userId,token},data:{token:newToken}});
    }

    async removeFCMToken(param: { where: Prisma.FCMTokenWhereUniqueInput }) {
        return await this.prisma.fCMToken.delete({ ...param });
    }

}