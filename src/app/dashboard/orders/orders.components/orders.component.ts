import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ClrWizard } from '@clr/angular';

import { DialogService } from 'src/app/providers/dialog.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/providers/customer.service';
import { Customer } from 'src/app/models/customer.model';
import { Product } from 'src/app/models/product.model';
import { CategoryEnum } from 'src/app/utils/enums/CategoryEnum';
import { ProductService } from 'src/app/providers/product.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})

export class OrdersComponent implements OnInit {
  @ViewChild('wizardxl', {static: true}) wizardExtraLarge: ClrWizard;
  xlOpen = false;

  formCustomer: FormGroup;

  customerSelected: Customer = {
    name: 'Nenhum',
  };

  customers: Customer[];

  controllersCustomer: string[] = [];
  erro: string[] = [];
  showModal: boolean;
  submitLoading = false;
  buttonSubmitText: string;
  value: string;
  phone: string;
  productCategory: CategoryEnum;
  products: Product[] = [];
  productsOfOrder: Product[] = [];
  productsFiltred: Product[] = [];
  additionalsFiltred: Product[] = [];

  blockCheckboxProduct: Boolean = false;
  blockCheckboxAdditionals: Boolean = false;

  constructor(
    private activiteRouter: ActivatedRoute,
    private customerService: CustomerService,
    private dialogService: DialogService,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
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
      referencePoint: [''],
    });

    this.controllersCustomer = Object.keys(this.formCustomer.controls);

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.phone = this.activiteRouter.snapshot.queryParams['phone'];
      }
    });
  }

  ngOnInit() {
    this.listCustomers();
    this.listProducts();
  }

  listCustomers() {
    this.customers = [];
    this.customerService.getAllCustomers().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
      for (const i in data) {
        this.customers.push(data[i]);
      }
      if (this.phone !== null && this.phone !== undefined) {
        this.searchCustomer();
      }
    });
  }

  searchCustomer(): void {
    if (this.phone === null || this.phone === undefined) {
      this.dialogService.confirm(
        `Digite um telefone para realizar a consulta de clientes`
      );
    } else {
      const customerFiltred: Customer = this.customers.filter(
        (m) => m.phone === this.phone.trim()
      )[0];
      if (customerFiltred === null || customerFiltred === undefined) {
        this.dialogService.confirm(`Cliente não encontrado`);
      } else {
        this.customerSelected = customerFiltred;
        for (const controller of this.controllersCustomer) {
          this.formCustomer.controls[`${controller}`].setValue(
            customerFiltred[`${controller}`]
          );
        }
      }
    }
  }
  transformToCurrency(num: string): string {
    return `R$ ${parseFloat(num).toFixed(2)}`;
  }

  wizardProducts(): void {
    this.wizardExtraLarge.close();
    this.wizardExtraLarge.reset();
    this.additionalsFiltred = [];
    this.productsFiltred = [];
    this.productCategory = null;
    this.xlOpen = true;
  }

  pageLoading(): void {
    if (this.currentPageIndex === 1) {
      this.productsFiltred = this.products.filter(
        (m) => +m.category === +this.productCategory
      );
      this.productsFiltred.forEach(p => p['isChecked'] = false);
    } else if (this.currentPageIndex === 2) {
      this.additionalsFiltred = this.products.filter(
        (m) => +m.category === +CategoryEnum.additional
      );
      this.additionalsFiltred.forEach(p => p['isChecked'] = false);
    }
  }

  get currentPageIndex() {
    return this.wizardExtraLarge.pageCollection.getPageIndex(this.wizardExtraLarge.currentPage);
  }

  listProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = [];
      // tslint:disable-next-line: forin
      for (const i in data) {
        this.products.push(data[i]);
      }
    });
  }

  checkedProdutcs(): void {
    this.blockCheckboxProduct = this.productsFiltred.filter(p => p['isChecked']).length >= 2;
  }

  checkedAdditionals(): void {
    console.log(this.additionalsFiltred)
    this.blockCheckboxAdditionals = this.additionalsFiltred.filter(p => p['isChecked']).length >= 1;
  }
}
