import { Injectable, Req } from '@nestjs/common';

import { AuthRepository } from 'src/auth/auth.repository';
import { MESSAGE } from 'src/constants/messages';
import { UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import {  CartDto } from './dto/user.dto';

@Injectable()
export class UserService {

  constructor(private readonly authRepository:AuthRepository,private readonly userRepository:UserRepository){}
  
  async getMe(@Req() req){

    const user=await this.authRepository.getUser({where:{id:req.user.id}})
    if(!user){  
      throw new Error(MESSAGE.ERROR.USER.NOT_FOUND)

    }

    delete user.password
    return user


  }

  async addToCart(data:CartDto,@Req() req){
   
   const cart=await this.userRepository.upsertCart({data:{User:{connect:{id:req.user.id}}},where:{userId:req.user.id}})

   const {id:cartID,...rest}=cart
   
   return await this.userRepository.addCartItem({data:{Book:{connect:{id:data.bookId}},quantity:data.quantity,cart:{connect:{id:cartID}}},where:{bookId:data.bookId,cartId:cartID}})

  }

  async updateCartItem(body:CartDto,@Req() req)
  {
    const {quantity,bookId}=body
    const {id:userId}=req.user
    
    const cart=await this.userRepository.getCart({where:{userId},select:{id:true}})
    console.log(cart);
    return true;

    // return await this.userRepository.updateCartItemQuantity({where:{bookId,cartId:cart.id},data:{quantity}})
  }

  async getCart(@Req() req)
  {
    try {
      return await this.userRepository.getCart({where:{userId:req.user.id},select:{CartItem:{select:{quantity:true,Book:true,id:true}}}})
      
    } catch (error) {
      console.log(error)
      throw error;

    }
  }
  
}
