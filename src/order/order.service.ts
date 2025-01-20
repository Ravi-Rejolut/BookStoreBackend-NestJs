import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatus } from './dto/order.dto';
import { OrderRepository } from './order.respository';
import { UserRepository } from 'src/user/user.repository';
import { MESSAGE } from 'src/constants/messages';
import { Prisma } from '@prisma/client';


@Injectable()
export class OrderService {

  constructor(private readonly orderRepository: OrderRepository, private readonly userRepository: UserRepository) { }



  async createOrder(req, body: CreateOrderDto) {
    const { id } = req.user;
    const { shippingId } = body;

    try {
      // Fetch cart
      const cart = await this.userRepository.getCart({
        where: { userId: id },
        select: { id: true },
      });
      if (!cart) {
        throw new ConflictException(MESSAGE.ERROR.CART.NOT_FOUND);
      }

      // Fetch cart items
      const cartItems = await this.userRepository.getCartItems({
        where: { cartId: cart.id },
        select: {
          quantity: true,
          bookId: true,
          Book: {
            select: {
              price: true,
              available: true,
              quantity: true,
              name: true,
            },
          },
        },
      });
      if (!cartItems || cartItems.length === 0) {
        throw new ConflictException(MESSAGE.ERROR.CART.ITEM.NOT_FOUND);
      }

      // Check book availability and calculate total amount
      const { updateBookData, totalAmount } = await this.checkBookAvailability(cartItems);

      // Prepare order items
      const orderItems = cartItems.map(({ bookId, quantity }) => ({ bookId, quantity }));

      // Create order
      const createOrder = await this.orderRepository.createOrder({
        data: {
          user: { connect: { id } },
          shipping: { connect: { id: shippingId } },
          OrderItem: { createMany: { data: orderItems } },
          totalAmount,
          invoiceNumber: `BS-${Date.now().toString()}`,
        },
        cartId: cart.id,
        updateBookData,
      });

      return createOrder;
    } catch (error) {
      console.error('Order Creation Error:', error);
      throw new Error(MESSAGE.ERROR.ORDER.CREATION_FAILED);
    }
  }

  async updateOrderStatus(orderId: string, body: UpdateOrderStatus) {
    try {

      const { orderStatus } = body

      return await this.orderRepository.updateOrderStatus({ where: { id: orderId }, data: { orderStatus } })
    } catch (error) {

      throw new Error(MESSAGE.ERROR.ORDER.UPDATE_FAILED)
    }
  }
  async checkBookAvailability(cartItems) {
    let updateBookData = [];
    let totalAmount = 0;

    for (const cartItem of cartItems) {
      const { Book, quantity } = cartItem;

      if (!Book.available) {
        throw new ConflictException(MESSAGE.ERROR.BOOK.NOT_AVAILABLE);
      }

      if (quantity > Book.quantity) {
        throw new ConflictException(`${Book.name} is out of stock. Please choose another book.`);
      }

      const leftQuantity = Book.quantity - quantity;
      updateBookData.push({
        id: cartItem.bookId,
        available: leftQuantity > 0,
        quantity: leftQuantity,
      });

      totalAmount += Book.price * quantity;
    }

    return { updateBookData, totalAmount };
  }


  async getOrders(query, req) {
    try {

      const { id } = req.user
      const { take, skip, orderBy, search, paymentStatus, orderStatus } = query


      let whereInput: Prisma.OrderWhereInput = {
        userId: id
      }

      if (paymentStatus) {
        whereInput.paymentSatus = paymentStatus
      }

      if (orderStatus) {

        whereInput.orderStatus = orderStatus
      }

      if (search) {
        whereInput.OR = [
          { invoiceNumber: { contains: search, mode: "insensitive" } },
          {
            OrderItem: {
              some: {
                Book: {
                  name: {
                    contains: search,
                    mode: "insensitive"
                  }
                }
              }
            }
          }
        ]
      }



      const { orders, count } = await this.orderRepository.getOrders({
        where: whereInput,
        include: {
          OrderItem: {
            select: {
              id: true,
              Book: {
                select: {
                  id: true,
                  name: true,
                  bookPhoto: {
                    select: {
                      url: true
                    }
                  },
                  description: true,
                  Author: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  price: true,
                  Category: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  rating: true

                }
              },
              quantity: true,


            }
          }, shipping: true
        },
        take: take,
        skip: skip,
      })


      return { orders, paginationCount: count }

    } catch (error) {
      throw new Error(MESSAGE.ERROR.ORDER.NOT_FOUND)
    }
  }


  async getOrderByOrderID(orderId, req) {

    try {


      return await this.orderRepository.getOrdersByOrderID({
        where: {
          id: orderId,
          userId: req.user.id,
        },
        include: {
          OrderItem: {
            select: {
              id: true,
              Book: {
                select: {
                  id: true,
                  name: true,
                  bookPhoto: {
                    select: {
                      url: true
                    }
                  },
                  description: true,
                  Author: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  price: true,
                  Category: {
                    select: {
                      id: true,
                      name: true
                    }
                  },
                  rating: true

                }
              },
              quantity: true,


            }
          }, shipping: true
        }
      })



    } catch (error) {
      throw new Error(MESSAGE.ERROR.ORDER.FETCH_FAILED)
    }

  }

}
