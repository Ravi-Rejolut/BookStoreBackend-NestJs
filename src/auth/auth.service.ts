import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { loginDto, signupDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';
import { MESSAGE } from 'src/constants/messages';
import { Prisma, Role } from '@prisma/client';
import { TOKEN_TYPE } from 'src/utils/utils.dto';
import { UtilsService } from 'src/utils/utils.service';
import { CONSTANT } from 'src/constants/constants';

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly utilsService: UtilsService
  ) { }

  async signup(body: signupDto) {
    try {

      const user = await this.authRepository.getUser({
        where: {
          email: body.email
        }
      }

    )
  
      if (user) {
        throw new Error(MESSAGE.ERROR.USER.ALREADY_EXISTS)
      }

      const salt = await bcrypt.genSaltSync();

      const passwordHash = await bcrypt.hash(body.password, salt);


      const createduser = await this.authRepository.createUser({
        data: {
          ...body,
          password: passwordHash
        }
      })

      delete createduser.password
      return "User Created Successfully";


    } catch (error) {

      console.log(error)
      throw new Error(MESSAGE.ERROR.USER.CREATION_FAILED)

    }


  
  }
  async login(body: loginDto) {

    try {
      const user=await this.authRepository.getUser({
        where: {
          email: body.email
        },
        select:{
          id:true,
          name:true,
          email:true,
          phone:true,
          password:true

        }
      })

      if(!user)
      {
        throw new Error(MESSAGE.ERROR.USER.NOT_FOUND)
      }

      const passMatch=await bcrypt.compare(body.password,user.password)

      if(!passMatch)
      {

        throw new Error(MESSAGE.ERROR.USER.CHECK_CREDENTIALS)
      }

      const payload={
        id:user.id,
        tokenType:TOKEN_TYPE.LOGIN,

      }
      const token=await this.utilsService.createToken(payload,CONSTANT.TOKEN_EXPIRY)
     

      return {token};

    } catch (error) {
      throw new Error(MESSAGE.ERROR.USER.LOGIN_FAILED)
    }
  
  }

}
