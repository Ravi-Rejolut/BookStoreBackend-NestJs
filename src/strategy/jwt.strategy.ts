import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthRepository } from 'src/auth/auth.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MESSAGE } from 'src/constants/messages';
import {VerifyCallback} from "jsonwebtoken"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,"jwt") {


    constructor(private readonly authRepository: AuthRepository) {
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:process.env.JWT_SECRET
            
        });

    }


    async validate(payload: any,done:VerifyCallback) {

        const user=await this.authRepository.getUser({
            where:{id:payload.id},
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
        });
        if(!user){
            throw new UnauthorizedException(MESSAGE.ERROR.ACCESS_DENIED);
        }
        done(null ,user);

    }


    
}