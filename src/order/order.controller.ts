import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  OrderFetchDto,
  UpdateOrderStatus,
} from './dto/order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGaurd } from 'src/gaurd/roles.gaurd';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Req() req, @Body() body: CreateOrderDto) {
    return await this.orderService.createOrder(req, body);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGaurd([Role.ADMIN, Role.MANAGER]))
  @Patch('status/:OrderId')
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden for unauthorized roles' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBody({ type: UpdateOrderStatus })
  async updateOrderStatus(
    @Req() req,
    @Param('OrderId') orderId: string,
    @Body() body: UpdateOrderStatus,
  ) {
    return await this.orderService.updateOrderStatus(orderId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Fetch orders with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns a list of orders' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of orders per page',
  })
  async getOrders(@Query() query: OrderFetchDto, @Req() req) {
    return await this.orderService.getOrders(query, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':OrderId')
  @ApiOperation({ summary: 'Fetch order details by order ID' })
  @ApiResponse({ status: 200, description: 'Returns order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrdersByOrderId(@Param('OrderId') orderId: string, @Req() req) {
    return await this.orderService.getOrderByOrderID(orderId, req);
  }
}
