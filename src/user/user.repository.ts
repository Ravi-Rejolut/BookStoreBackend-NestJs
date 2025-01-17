import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { MESSAGE } from "src/constants/messages";
import { PrismaService } from "src/prisma/prisma.service";
import { cartWithCartItem } from "./dto/user.dto";

@Injectable()
export class UserRepository {

    constructor(private readonly prisma: PrismaService) { }


    async getAllUsers(params: { where: Prisma.UserWhereInput, orderBy?: Prisma.SortOrder, skip?: number, take?: number, select?: Prisma.UserSelect }) {
        try {

            const users = await this.prisma.user.findMany({ where: params.where, skip: params.skip, take: params.take, select: params.select, orderBy: { createdAt: params.orderBy } });
            return { users, count: users.length }

        } catch (error) {
            throw new Error(MESSAGE.ERROR.USER.FETCH_FAILED)
        }
    }

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

    async getCart(params: { where: Prisma.CartWhereUniqueInput, select?: Prisma.CartSelect}) {
        try {
            const cart = await this.prisma.cart.findUnique(params)
            return cart;
        } catch (error) {
            throw error
        }

    }

    async updateCartItemQuantity(params: { where: Prisma.CartItemWhereInput, data: Prisma.CartItemUpdateInput }) {
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

    async deleteCartItem(params: { where: Prisma.CartItemWhereUniqueInput }) {
        try {
            return await this.prisma.cartItem.delete({ where: params.where })
        } catch (error) {
            throw error
        }
    }

    async addShippingDetails(params: { data }) {
        try {
            return await this.prisma.shipping.create({ ...params })
        } catch (error) {
            throw error
        }
    }

    async getShippingDetails(params: { where: Prisma.ShippingWhereInput, select?: Prisma.ShippingSelect }) {

        try {
            
            return await this.prisma.shipping.findMany({...params})

            
        } catch (error) {
            throw error
        }
    }
}