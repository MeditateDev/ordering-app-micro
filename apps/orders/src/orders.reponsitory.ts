import { AbstractReponsitory } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Order } from "./schemas/order.schema";

@Injectable()
export class OrdersRepository extends AbstractReponsitory<Order>{
    protected readonly logger = new Logger(OrdersRepository.name);

    constructor(
        @InjectModel(Order.name) orderModel: Model<Order>,
        @InjectConnection() connection: Connection,
    ){
        super(orderModel, connection);
    }
}