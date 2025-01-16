import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { MESSAGE } from "src/constants/messages";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserRepository {

    constructor(private readonly prisma: PrismaService) { }


    async upsertCart(params: {
        data: Prisma.CartCreateInput
        where?: Prisma.CartWhereUniqueInput,

    }) {

        try {

            const { data, where } = params;

            return await this.prisma.cart.upsert({ where, create: data, update: data })

        } catch (error) {
            throw error;
        }

    }

    async addCartItem(params: { data: Prisma.CartItemCreateInput, where: Prisma.CartItemWhereInput }) {
        try {
            const cartItem = await this.prisma.cartItem.findFirst({ where: params.where })

            if (!cartItem) {
                return await this.prisma.cartItem.create({ data: params.data })
            }
           
        } catch (error) {
            throw error;
        }

    }

    async getCart(params: { where: Prisma.CartWhereUniqueInput, select?: Prisma.CartSelect, include?: Prisma.CartInclude }) {
        try {
            const cart = await this.prisma.cart.findMany({ ...params })
            return cart;
        } catch (error) {
            throw error
        }

    }

    async updateCartItemQuantity(params:{where:Prisma.CartItemWhereInput,data:Prisma.CartItemUpdateInput}) {
        try {

            const cartItem = await this.prisma.cartItem.findFirst({ where: params.where })

            if (!cartItem) {
                throw new Error(MESSAGE.ERROR.CART.ITEM.NOT_FOUND)
            }

            return await this.prisma.cartItem.update({ where: { id: cartItem.id }, data: { quantity: params.data.quantity } })

        } catch (error) {
            throw error
        }
    }

}