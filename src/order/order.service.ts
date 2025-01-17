import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { OrderRepository } from './order.respository';
import { UserRepository } from 'src/user/user.repository';
import { MESSAGE } from 'src/constants/messages';


@Injectable()
export class OrderService {

  constructor(private readonly orderRepository: OrderRepository, private readonly userRepository: UserRepository) { }

  async createOrder(req, body: CreateOrderDto) {
    const { id } = req.user;
    const { shippingId } = body

    const cart = await this.userRepository.getCart({
      where: { userId: id },
      select: {
        id: true,
        CartItem: {
          select: {
            quantity: true,
            bookId: true,
            Book: {
              select: {
                price: true,
                available: true,
                quantity: true,
                name: true,

              }
            }

          }
        }
      }
    });
    if (!cart) {
      throw new ConflictException(MESSAGE.ERROR.CART.NOT_FOUND)
    }


    const { updateBookData, amount } = await this.checkBookAvailability(cart);



    const createOrder=await this.orderRepository.createOrder({
      data:{
          user:{
            connect:{id}
          },
          shipping:{
            connect:{
              id:shippingId
            }
          },
          OrderItem:{
            createMany:{data:cart.CartItem}
          }


      }
    })



    return true;


  }

  async checkBookAvailability(cart) {
    let updateBookData = [];
    let amount = 0;

    cart.CartItem.forEach((cartItem) => {

      if (!cartItem.Book.available) {
        throw new ConflictException(MESSAGE.ERROR.BOOK.NOT_AVAILABLE)
      }
      else if (cartItem.quantity > cartItem.Book.quantity) {
        throw new ConflictException(`${cartItem.Book.name} is out of stock. Please choose another book.`)
      }

      const leftQuantity = cartItem.Book.quantity - cartItem.quantity;
      const isAvailable = leftQuantity > 0;
      updateBookData.push({ id: cartItem.bookId, available: isAvailable, quantity: leftQuantity })
      amount += Number(cartItem.Book.price * cartItem.quantity)



    })

    return { updateBookData, amount };

  }

}
