import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { MESSAGE } from "src/constants/messages";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthRepository {

    constructor(private readonly prisma: PrismaService) {

    }



    async getUser(params: {
        where: Prisma.UserWhereUniqueInput;
        select?: Prisma.UserSelect;
        include?: Prisma.UserInclude;
    }) {
        try {
            return await this.prisma.user.findUnique({ ...params });
        } catch (error) {
            throw new Error(MESSAGE.ERROR.USER.FETCH_FAILED)
        }

    }



    async createUser(params: {
        data: Prisma.UserCreateInput;
    }) {

        try {
            const {data}=params;
            return await this.prisma.user.create({
                data
            })

        } catch (error) {

            console.log(error)
            throw new Error(MESSAGE.ERROR.USER.CREATION_FAILED)
        }
    }
}