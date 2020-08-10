import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/providers/order.service';
import { DialogService } from 'src/app/providers/dialog.service';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {

  orders: Order[];
  submitLoading = false;

  constructor(
    private orderService: OrderService,
    private dialogService: DialogService,
  ) {
    this.listOrders();
  }

  ngOnInit() {

  }

  listOrders() {
    this.orders = [];
    this.orderService.getAllOrders().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
      for (const i in data) {
        this.orders.push(data[i]);
      }
    });
  }

  onUpdateOrder(order: Order) {
    console.log(order);

    this.submitLoading = true;
    this.dialogService.confirm('Deseja despachar o pedido?')
    .then((canFinalize: boolean) => {
      if (canFinalize) {
        this.orderService.updateOrder(order).subscribe(data => {
          this.dialogService.confirm(`Pedido criado com sucesso.`);

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
