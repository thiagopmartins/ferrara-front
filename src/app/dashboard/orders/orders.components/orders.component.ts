import { Component, OnInit } from '@angular/core';

import { Discount } from 'src/app/models/discount.model';
import { DialogService } from 'src/app/providers/dialog.service';
import { DiscountService } from 'src/app/providers/discount.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PermissionEnum } from 'src/app/utils/enums/PermissionEnum';
import { DiscountTypeEnum } from 'src/app/utils/enums/DiscountTypeEnum';
import { CustomerService } from 'src/app/providers/customer.service';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  formCustomer: FormGroup;

  customerSelected: Customer = {
    name: 'Nenhum'
  };

  customers: Customer[];

  controllersCustomer: string[] = [];
  erro: string[] = [];
  showModal: boolean;
  submitLoading = false;
  buttonSubmitText: string;
  value: string;
  phone: string;

  constructor(
    private discountService: DiscountService,
    private customerService: CustomerService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.formCustomer = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: [''],
      district: [''],
      number: [],
      block: [''],
      aptoBlock: [''],
      apto: [''],
      lot: [''],
      deliveryTax: [Validators.required],
      referencePoint: ['']
    });

    this.controllersCustomer = Object.keys(this.formCustomer.controls);
  }

  ngOnInit() {
    this.listCustomers();
  }

  listCustomers() {
    this.customers = [];
    this.customerService.getAllCustomers().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
      for (const i in data) {
        this.customers.push(data[i]);
      }
    });
  }

  searchCustomer(): void {
    const customerFiltred: Customer = this.customers.filter(m => m.phone === this.phone.trim())[0];
    if (customerFiltred === null || customerFiltred === undefined) {
      this.dialogService.confirm(`Cliente não encontrado`);
    } else {
      for (const controller of this.controllersCustomer) {
        this.customerSelected = customerFiltred;
        this.formCustomer.controls[`${controller}`].setValue(customerFiltred[`${controller}`]);
      }
    }
  }
}
