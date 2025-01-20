import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { BookRepository } from "src/book/book.repository";
import { MESSAGE } from "src/constants/messages";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderRepository {


    constructor(private readonly prisma: PrismaService, private readonly bookReposity: BookRepository) { }


    async createOrder(params: { data: Prisma.OrderCreateInput, updateBookData: any, cartId: string }) {
        try {

            const { data, updateBookData, cartId } = params;
            return await this.prisma.$transaction(async (tx) => {
                const order = await tx.order.create({ data });

                await tx.cart.update({
                    where: { id: cartId },
                    data: {
                        CartItem: {
                            deleteMany: {},
                        }
                    }
                })


                await Promise.all(
                    updateBookData.map(({ id, available, quantity }) => {

                        return tx.book.update({ where: { id }, data: { available, quantity } })

                    })
                )

                return { order }

            },
                {
                    maxWait: 10000,
                    timeout: 20000
                }
            )

        } catch (error) {
            console.log(error)
            throw new Error(MESSAGE.ERROR.ORDER.CREATION_FAILED);
        }
    }




    async getOrders(params: { where: Prisma.OrderWhereInput, select?: Prisma.OrderSelect, include?: Prisma.OrderInclude, take?: number, skip?: number }) {

        try {
            const orders = await this.prisma.order.findMany({ ...params });
            const orderCount = await this.prisma.order.count({ where: params.where })

            return { orders, count: orderCount }

        } catch (error) {
            throw new Error(MESSAGE.ERROR.ORDER.FETCH_FAILED);
        }
    }
    async getOrdersByOrderID(params: { where: Prisma.OrderWhereUniqueInput, select?: Prisma.OrderSelect, include?: Prisma.OrderInclude }) {

        try {
            return await this.prisma.order.findUnique({ ...params });


        } catch (error) {
            throw new Error(MESSAGE.ERROR.ORDER.FETCH_FAILED);
        }
    }

    async updateOrderStatus(params: { where: Prisma.OrderWhereUniqueInput, data: Prisma.OrderUpdateInput }) {

        try {
                return await this.prisma.order.update({ where: params.where, data: params.data });
        } catch (error) {
            throw new Error(MESSAGE.ERROR.ORDER.UPDATE_FAILED)
        }
    }
}