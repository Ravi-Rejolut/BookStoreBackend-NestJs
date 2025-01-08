import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { MESSAGE } from "src/constants/messages";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BookRepository {

    constructor(private readonly prisma: PrismaService) { }


    async getCategory(params: {
        where: Prisma.CategoryWhereUniqueInput,
        select?: Prisma.CategorySelect,
        include?: Prisma.CategoryInclude,

    }) {
        try {
            return await this.prisma.category.findUnique({ ...params })

        } catch (error) {
            throw error
        }

    }


    async createCategory(params: { data: Prisma.CategoryCreateInput }) {
        try {
            return await this.prisma.category.create({ ...params })

        } catch (error) {
            throw error
        }
    }


    async getAllCategories(
    ) {
        return await this.prisma.category.findMany()

    }


    async getAuthor(params: {
        where: Prisma.AuthorWhereUniqueInput,
        select?: Prisma.AuthorSelect,
        include?: Prisma.AuthorInclude,

    }) {

        try {

            return await this.prisma.author.findUnique({ ...params })

        } catch (error) {
            throw new Error(MESSAGE.ERROR.AUTHOR.FETCH_FAILED)
        }
    }


    async createAuthor(params:{data:Prisma.AuthorCreateInput}){
        try {
            
        } catch (error) {
            
        }

    }

}