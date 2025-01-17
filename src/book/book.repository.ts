import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { count } from "console";
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

    async updateCategory(params: { data: Prisma.CategoryUpdateInput, where: Prisma.CategoryWhereUniqueInput }) {
        try {
            return await this.prisma.category.update({ ...params })
        }
        catch (error) {
            throw error
        }
    }


    async getAllCategories(
    ) {
        return await this.prisma.category.findMany()

    }

    async getAllAuthors()
    {
        return await this.prisma.author.findMany()
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


    async createAuthor(params: { data: Prisma.AuthorCreateInput }) {
        try {
            return await this.prisma.author.create({ ...params })
        } catch (error) {
            throw new Error(MESSAGE.ERROR.AUTHOR.CREATION_FAILED);
        }

    }

    async getBook(params: {
        where: Prisma.BookWhereInput,
        select?: Prisma.BookSelect,
        include?: Prisma.BookInclude,
    }) {
        try {
            return await this.prisma.book.findFirst({ ...params });

        } catch (error) {
            throw new Error(MESSAGE.ERROR.BOOK.FETCH_FAILED)
        }
    }

    async addBookImageUrl(params: { data: Prisma.BookPhotosCreateInput }) {
        try {
            return await this.prisma.bookPhotos.create({ ...params })
        } catch (error) {
            throw new Error(MESSAGE.ERROR.BOOK.FAILED_IMAGE_UPLOAD)
        }
    }

    async createBook(params: { data: Prisma.BookCreateInput }) {
        try {
            return await this.prisma.book.create({
                ...params
            })
        } catch (error) {
            console.log(error)
            throw new Error(MESSAGE.ERROR.BOOK.CREATION_FAILED);
        }
    }

    async updateBook(params: { where: Prisma.BookWhereUniqueInput, data: Prisma.BookUpdateInput, select?: Prisma.BookSelect, include?: Prisma.BookInclude }) {
        try {
            return await this.prisma.book.update({ ...params })
        } catch (error) {
            throw new Error(MESSAGE.ERROR.BOOK.FAILED_UPDATE)
        }
    }

    async getBookImage(params: { where: Prisma.BookPhotosWhereUniqueInput, select?: Prisma.BookPhotosSelect, include?: Prisma.BookPhotosInclude }) {
        try {

            return this.prisma.bookPhotos.findUnique({ ...params })
        } catch (error) {
            throw error
        }
    }

    async deleteBookImage(params:{where:Prisma.BookPhotosWhereUniqueInput}){
        try {
            return await this.prisma.bookPhotos.delete({ ...params })
        } catch (error) {
            throw error
        }
    }
    async getAllBooks(params: {
        where: Prisma.BookWhereInput,
        take?:number,
        skip?:number,
        orderBy?:Prisma.SortOrder,
        select?: Prisma.BookSelect,
        include?: Prisma.BookInclude

    }) {

        let include = params.include ? params.include : { Author: true, Category: true, bookPhoto: true };
        const books = await this.prisma.book.findMany({ ...params, include,orderBy:{createdAt:params.orderBy} });
        return {books,count:books.length}
    }
}