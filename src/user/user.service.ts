import { Injectable, Req } from '@nestjs/common';

import { AuthRepository } from 'src/auth/auth.repository';
import { MESSAGE } from 'src/constants/messages';
import { UserRepository } from './user.repository';
import { Prisma, Role } from '@prisma/client';
import { AddressDto, CartDto, UserFetchDto } from './dto/user.dto';
import { serachQueryWithPagination } from 'src/constants/dto';

@Injectable()
export class UserService {

  constructor(private readonly authRepository: AuthRepository, private readonly userRepository: UserRepository) { }

  async getMe( req) {

    const user = await this.authRepository.getUser({ where: { id: req.user.id } })
    if (!user) {
      throw new Error(MESSAGE.ERROR.USER.NOT_FOUND)

    }

    delete user.password
    return user


  }

  async getAllUsers(query:UserFetchDto,req)
  {
    try {
        
        const {search,page,take,orderBy,skip,role} = query;
        let where:Prisma.UserWhereInput ={};
        let select:Prisma.UserSelect={};

        if(search)
        {
          where.OR=[
            {name:{contains:search,mode:"insensitive"}},
            {email:{contains:search,mode:"insensitive"}},
            {phone:{contains:search,mode:"insensitive"}}
          ]
        }
        // skip ADMIN AND MANAGER
       
          where.role=role;
       


        select={
          id:true,
          name:true,
          email:true,
          phone:true,
          role:true,
          createdAt:true,
          updatedAt:true
        }
     

        const {users,count}=await this.userRepository.getAllUsers({where,select,take,orderBy,skip});

        return {users,paginationCount:count};
    } catch (error) {
      throw new Error(MESSAGE.ERROR.USER.FETCH_FAILED)
    }
  }

  async addToCart(data: CartDto,  req) {

    const cart = await this.userRepository.upsertCart({ data: { User: { connect: { id: req.user.id } } }, where: { userId: req.user.id } })

    const { id: cartID, ...rest } = cart

    return await this.userRepository.addCartItem({ data: { Book: { connect: { id: data.bookId } }, quantity: data.quantity, cart: { connect: { id: cartID } } }, where: { bookId: data.bookId, cartId: cartID } })

  }

  async updateCartItem(body: CartDto,  req) {
    const { quantity, bookId } = body
    const { id: userId } = req.user

    const cart = await this.userRepository.getCart({ where: { userId } })
    if (!cart) throw new Error(MESSAGE.ERROR.CART.NOT_FOUND)
    if (quantity > 0) {

      return await this.userRepository.updateCartItemQuantity({ where: { bookId, cartId: cart.id }, data: { quantity } })
    }
    else {
     await this.userRepository.deleteCartItem({
        where: {
          cartId_bookId: {
            cartId: cart.id,
            bookId,
          },
        }
      })
      return { message: MESSAGE.SUCCESS.CART.ITEM_REMOVED }
    }
  }



  async getCart(req) {
    try {
      return await this.userRepository.getCart({ where: { userId: req.user.id }, select: { CartItem: { select: { quantity: true, Book: true, id: true } } } })

    } catch (error) {
      console.log(error)
      throw error;

    }
  }

  async getShippingDetails(req)
  {

    const {id}=req.user;

    const addresses=await this.userRepository.getShippingDetails({where:{userId:id,isActive:true},select:{id:true,address1:true,address2:true,city:true,state:true,postalCode:true,country:true,createdAt:true,updatedAt:true,default:true}});

    return addresses;

  }

  async addShippingDetails(req,body:AddressDto)
  {
    try {
      const data:Prisma.ShippingCreateInput={...body,User:{connect:{id:req.user.id}}}

      return this.userRepository.addShippingDetails({data});

      
    } catch (error) {
      throw new Error(MESSAGE.ERROR.SHIPPING.CREATION_FAILED)
    }
  }

  async updateShippingDetails(req,body:AddressDto,addressId:string)
  {
    try {
    
      await this.userRepository.updateShippingDetails({where:{id:addressId,userId:req.user.id},data:{isActive:false}});
         
      await this.addShippingDetails(req,body);

      return MESSAGE.SUCCESS.SHIPPING.UPDATED;
    } catch (error) {
      throw new Error(MESSAGE.ERROR.SHIPPING.UPDATE_FAILED)
    }
  }

}
