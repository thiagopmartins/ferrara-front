import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/providers/order.service';
import { DialogService } from 'src/app/providers/dialog.service';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { getLocaleDateFormat } from '@angular/common';
import { OrderStatusEnum } from 'src/app/utils/enums/OrderStatusEnum';
import { Deliveryman } from 'src/app/models/deliveryman.model';
import { DeliverymanService } from 'src/app/providers/deliveryman.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {

  orders: Order[];
  ordersInProduction: Order[];
  ordersInDelivery: Order[];
  ordersFinished: Order[];
  deliveryman: Deliveryman[];
  deliverymanSelected: Deliveryman;

  submitLoading = false;

  constructor(
    private orderService: OrderService,
    private dialogService: DialogService,
    private deliverymanService: DeliverymanService
  ) {
    this.listOrders();
  }

  ngOnInit() {
    this.listDeliveryman();
  }

  listDeliveryman() {
    this.deliveryman = [];

    this.deliverymanService.getAllDeliverymans().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
      for (const i in data) {
        this.deliveryman.push(data[i]);
      }
    });
  }

  listOrders() {
    this.orders = [];
    this.ordersInDelivery = [];
    this.ordersInProduction = [];
    this.ordersFinished= [];
    this.orderService.getAllOrders().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
      for (const i in data) {
        this.orders.push(data[i]);
      }
      this.ordersInProduction = this.orders.filter(o => +o.status === OrderStatusEnum.production).sort((a, b) => {
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
      this.ordersInDelivery = this.orders.filter(o => +o.status === OrderStatusEnum.sending).sort((a, b) => {
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
      this.ordersFinished = this.orders.filter(o => +o.status === OrderStatusEnum.finished).sort((a, b) => {
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
    });
  }

  onUpdateOrder(order: Order, status: OrderStatusEnum) {
    console.log(order);

    this.submitLoading = true;
    order.status = status;
    order.deliveryman = this.deliveryman.find(d => d._id === order.deliveryman);
    console.log(order);
    this.dialogService.confirm('Deseja alterar o status do pedido?')
    .then((canFinalize: boolean) => {
      if (canFinalize) {
        this.orderService.updateOrder(order).subscribe(data => {
          this.dialogService.confirm(`Pedido alterado com sucesso.`);

          this.listOrders();
        },
        () => (this.submitLoading = false));
      }
    });
  }

  getLocalDate(date): string{
    const dateFormated = moment(date).format('HH:mm:ss DD-MM-YYYY');

    return dateFormated.toLocaleString();
  }
}
