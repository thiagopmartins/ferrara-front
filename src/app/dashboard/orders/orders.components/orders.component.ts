import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ClrWizard } from '@clr/angular';

import { DialogService } from 'src/app/providers/dialog.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/providers/customer.service';
import { Customer } from 'src/app/models/customer.model';
import { Product } from 'src/app/models/product.model';
import { CategoryEnum } from 'src/app/utils/enums/CategoryEnum';
import { ProductService } from 'src/app/providers/product.service';
import { Order } from 'src/app/models/order.model';
import { Discount } from 'src/app/models/discount.model';
import { DiscountService } from 'src/app/providers/discount.service';
import { DiscountTypeEnum } from 'src/app/utils/enums/DiscountTypeEnum';
import { PaymentEnum } from 'src/app/utils/enums/PaymentEnum';

interface ProductOfOrder {
  products: Product[];
  additional: Product;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  @ViewChild('wizardxl', { static: true }) wizardExtraLarge: ClrWizard;
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
  productsOfOrder: ProductOfOrder[] = [];
  productsFiltred: Product[] = [];
  additionalsFiltred: Product[] = [];

  blockCheckboxProduct: Boolean = false;
  blockCheckboxAdditionals: Boolean = false;
  orderPrice = 0;
  order: Order = {
    price: 0.0,
  };

  discounts: Discount[] = [];
  discountFiltred: Discount = {
    value: 0.0,
    type: DiscountTypeEnum.value,
  };
  discountName: string;

  payment: PaymentEnum;

  change = 0.0;
  custumizeMoneyPayment = 0.0;

  constructor(
    private activiteRouter: ActivatedRoute,
    private customerService: CustomerService,
    private discountService: DiscountService,
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
      deliveryTax: [0.0, Validators.required],
      referencePoint: [''],
    });

    this.formCustomer.statusChanges.subscribe((value) => {
      this.getCustomer();
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
    this.listDiscounts();
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
    if (num === null || num === undefined) {
      num = '0.00';
    }
    return `R$ ${parseFloat(num).toFixed(2)}`;
  }

  getPriceProductOfOrder(order: ProductOfOrder): string {
    let price = 0;
    const productMax = order.products.reduce((prev, current) =>
      prev.price > current.price ? prev : current
    );
    price = productMax.price;
    if (order.additional !== undefined && order.additional !== undefined) {
      price += order.additional.price;
    }
    return `R$ ${parseFloat(`${price}`).toFixed(2)}`;
  }

  wizardProducts(): void {
    this.wizardExtraLarge.close();
    this.wizardExtraLarge.reset();
    this.additionalsFiltred = [];
    this.productsFiltred = [];
    this.productCategory = null;
    this.blockCheckboxProduct = false;
    this.blockCheckboxAdditionals = false;
    this.discountFiltred = {
      value: 0.0,
      type: DiscountTypeEnum.value,
    };
    this.xlOpen = true;
  }

  pageLoading(): void {
    if (this.currentPageIndex === 1) {
      this.productsFiltred = this.products.filter(
        (m) => +m.category === +this.productCategory
      );
      this.productsFiltred.forEach((p) => (p['isChecked'] = false));
    } else if (this.currentPageIndex === 2) {
      this.additionalsFiltred = this.products.filter(
        (m) => +m.category === +CategoryEnum.additional
      );
      this.additionalsFiltred.forEach((p) => (p['isChecked'] = false));
    }
  }

  get currentPageIndex() {
    return this.wizardExtraLarge.pageCollection.getPageIndex(
      this.wizardExtraLarge.currentPage
    );
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
    this.blockCheckboxProduct =
      this.productsFiltred.filter((p) => p['isChecked']).length >= 2;
  }

  checkedAdditionals(): void {
    this.blockCheckboxAdditionals =
      this.additionalsFiltred.filter((p) => p['isChecked']).length >= 1;
  }

  requestOrder() {
    const product: Product[] = this.productsFiltred.filter(
      (p) => p['isChecked']
    );
    const additional: Product = this.additionalsFiltred.filter(
      (p) => p['isChecked']
    )[0];

    this.productsOfOrder.push({
      additional: this.additionalsFiltred.filter((p) => p['isChecked'])[0],
      products: product,
    });

    const productMax = product.reduce((prev, current) =>
      prev.price > current.price ? prev : current
    );
    this.orderPrice += productMax.price;

    if (additional !== undefined && additional !== null) {
      this.orderPrice += additional.price;
    }

    this.reloadOrderPrice();
  }

  reloadOrderPrice(): void {
    // tslint:disable-next-line: no-bitwise
    this.order.price = this.orderPrice + (+this.getDeliveryTax() | 0); // SUBTRAIR O VALOR DO DESCONTO

    if (+this.discountFiltred.type === DiscountTypeEnum.value) {
      this.order.price -= this.discountFiltred.value;
    } else if (+this.discountFiltred.type === DiscountTypeEnum.percentage) {
      this.order.price -= (this.order.price * this.discountFiltred.value) / 100;
    }
  }

  getAdditionalItem(order: ProductOfOrder): string {
    if (order.additional === null || order.additional === undefined) {
      return '-';
    } else {
      return order.additional.name;
    }
  }

  getProductName(order: ProductOfOrder): string {
    if (order.products.length > 1) {
      return `${order.products[0].name}/${order.products[1].name}`;
    } else {
      return `${order.products[0].name}`;
    }
  }

  getCategoryName(order: ProductOfOrder): string {
    let name: string;
    switch (+order.products[0].category) {
      case 1: {
        name = 'Adicional/Borda';
        break;
      }
      case 2: {
        name = 'Pizza Salgada 35cm';
        break;
      }
      case 3: {
        name = 'Pizza Salgada 45cm';
        break;
      }
      case 4: {
        name = 'Pizza Doce 30cm';
        break;
      }
      case 5: {
        name = 'Pizza Doce 35cm';
        break;
      }
      case 6: {
        name = 'Bebida';
        break;
      }
    }

    return name;
  }

  getDeliveryTax(): string {
    return this.formCustomer.controls['deliveryTax'].value;
  }

  listDiscounts(): void {
    this.discounts = [];
    this.discountService.getAllDiscounts().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
      for (const i in data) {
        if (i === 'expireDate') {
          data[i] = new Date(data[i]).toDateString();
        }
        this.discounts.push(data[i]);
      }
    });
  }

  searchDiscount() {
    console.log(this.payment);
    if (this.discountName === null || this.discountName === undefined) {
      this.dialogService.confirm(`Digite o nome de um cupom`);
    } else {
      this.discountFiltred = this.discounts.filter(
        (m) => m.name === this.discountName.trim()
      )[0];
      if (this.discountFiltred === null || this.discountFiltred === undefined) {
        this.discountFiltred.value = 0.0;
        this.dialogService.confirm(`Cupom não encontrado`);
      } else {
        this.reloadOrderPrice();
      }
    }
  }

  getPaymentName(payment: PaymentEnum): string {
    let name: string;
    switch (+payment) {
      case 1: {
        name = 'Dinheiro';
        break;
      }
      case 2: {
        name = 'Cartão de Débito';
        break;
      }
      case 3: {
        name = 'Cartão de Crédito';
        break;
      }
    }
    return name;
  }

  convertToInt(str): number {
    return +str;
  }

  getChange(): string {
    let change: number =
      this.change -
      (+this.payment === PaymentEnum.moneyAndCard
        ? this.custumizeMoneyPayment
        : this.order.price);
    if (change < 0) {
      change = 0.0;
    }
    return change.toString();
  }

  getCardPayment(): string {
    let cardPay: number = this.order.price - this.custumizeMoneyPayment;
    if (cardPay < 0) {
      cardPay = 0.0;
    }

    return cardPay.toString();
  }

  showPrinterModal(): void {
    this.showModal = true;
  }

  paymentIsMoney(): Boolean {
    return +this.payment === PaymentEnum.money;
  }

  onDelete(order: ProductOfOrder): void {
    this.productsOfOrder = this.productsOfOrder.filter((p) => p !== order);
  }

  onPrint() {
    window.print();
  }

  getCustomer() {
    if (
      (this.customerSelected.name === 'Nenhum' &&
        this.formCustomer.controls['name'] !== undefined) ||
      this.customerSelected !== this.formCustomer.patchValue
    ) {
      this.customerSelected = this.formCustomer.value;
    }
  }

  getItensOnType(category: CategoryEnum): ProductOfOrder[] {
    const prod = this.productsOfOrder.filter(
      (m) => m.products.find((p) => +p.category === +category)
    );
    return prod;
  }

  getItensOnTypeCount(category: CategoryEnum): number {
    const prod = this.getItensOnType(category);
    return prod === undefined || prod === null ? 0 : prod.length;
  }

  getBorderName(order: ProductOfOrder): string {
    if (order.additional === undefined || order.additional === null) {
      return 'Sem borda';
    }
    return order.additional.name;
  }
}
