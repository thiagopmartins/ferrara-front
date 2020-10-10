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
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {

  deliveryman: Deliveryman[];

  submitLoading = false;

  constructor(
    private dialogService: DialogService,
    private deliverymanService: DeliverymanService
  ) {

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

  getLocalDate(date): string{
    const dateFormated = moment(date).format('HH:mm:ss DD-MM-YYYY');

    return dateFormated.toLocaleString();
  }

  getValue(value): number {
    if (value === undefined || value === null){
      value = 0;
    }

    return +value;
  }

  getTotal(deliveryMan) {
    // tslint:disable-next-line: max-line-length
    const category: number = (deliveryMan.category === undefined || deliveryMan.category === null) ? 0 : this.getValue(deliveryMan.category.value);
    // tslint:disable-next-line: max-line-length
    const category6: number = (deliveryMan.category6 === undefined || deliveryMan.category6 === null) ? 0 : this.getValue(deliveryMan.category6.value);
    // tslint:disable-next-line: max-line-length
    const category10: number = (deliveryMan.category10 === undefined || deliveryMan.category10 === null) ? 0 : this.getValue(deliveryMan.category10.value);
    const value = category + category6 + category10;
    return parseFloat(`${value}`).toFixed(2);
  }

  finalize() {
    this.dialogService.confirm('Deseja finalizar o expediente?')
    .then((canFinalize: boolean) => {
      if (canFinalize) {
        this.deliveryman.forEach(d => {
          d.category = {
            quantity: 0,
            value: 0
          },
          d.category10 = {
            quantity: 0,
            value: 0
          }
          d.category6 = {
            quantity: 0,
            value: 0
          }
          this.deliverymanService.updateDeliveryman(d).subscribe((data: {}) => {

          });
        }),
        // tslint:disable-next-line: no-unused-expression
        () => this.listDeliveryman();
      }
    });

  }
}
