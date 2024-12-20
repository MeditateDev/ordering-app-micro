import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.reponsitory';
import { BILLING_SERVICE } from './constant/service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository, @Inject(BILLING_SERVICE) private billingClient: ClientProxy) { }
  async createOrder(request: CreateOrderRequest) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        })
      )
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      console.log(err)
      throw err;
    }
  }
  async getOrder() {
    return this.ordersRepository.find({});
  }
}
