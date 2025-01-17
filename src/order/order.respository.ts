import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { BookRepository } from "src/book/book.repository";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderRepository {


    constructor(private readonly prisma:PrismaService,private readonly bookReposity: BookRepository){}


    async createOrder(params:{data:Prisma.OrderCreateInput})
    {

    }
}