import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { configData } from 'src/config';
import { createTokenDto } from './utils.dto';
import { CONSTANT } from 'src/constants/constants';

@Injectable()
export class UtilsService {

    constructor(
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService
    ){}

    config:any=configData(this.configService);

    async createToken(data:createTokenDto,exp=null)
    {

        try {
            
            const secret=this.config.JWT_SECRET;
            
            const token=await this.jwtService.signAsync(data,{
                secret,
                expiresIn:exp?exp:CONSTANT.TOKEN_EXPIRY
            })
            return token;
        } catch (error) {
            throw error
        }

    }

    async decodeToken(token:string){
        try {
            const secret=this.config.JWT_SECRET
            return await this.jwtService.verifyAsync(token,{secret})
        } catch (error) {
            throw error
        }
    }


}
