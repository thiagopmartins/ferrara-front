import { Component, OnInit } from "@angular/core";

import { Discount } from "src/app/models/discount.model";
import { DialogService } from "src/app/providers/dialog.service";
import { DiscountService } from "src/app/providers/discount.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { PermissionEnum } from "src/app/utils/enums/PermissionEnum";
import { DiscountTypeEnum } from "src/app/utils/enums/DiscountTypeEnum";

@Component({
  selector: "app-discounts",
  templateUrl: "./discounts.component.html",
  styleUrls: ["./discounts.component.css"]
})
export class DiscountsComponent implements OnInit {
  discounts: Discount[] = [];
  controllers: string[] = [];
  erro: string[] = [];
  discountSelected: Discount;
  showModal: boolean;
  form: FormGroup;
  submitLoading: boolean = false;
  buttonSubmitText: string;
  value: string;
  prefix: string;

  constructor(
    private discountService: DiscountService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      _id: [],
      name: ["", Validators.required],
      expireDate: ["", Validators.required],
      partner: [""],
      type: ["", Validators.required],
      value: [0.00],
    });
    this.controllers = Object.keys(this.form.controls);
  }

  ngOnInit() {
    this.listDiscounts();
  }

  listDiscounts() {
    this.discounts = [];
    this.discountService.getAllDiscounts().subscribe((data: {}) => {
      console.log(data)
      for (const i in data) {
        if(i === 'expireDate'){
          data[i] = new Date(data[i]).toDateString()
        }
        this.discounts.push(data[i]);
      }
      console.log(data)
    });
  }

  onCreate(): void {
    this.form.reset();
    this.submitLoading = false;
    if (this.discountSelected) {
      this.discountSelected = null;
    }
    this.buttonSubmitText = "Cadastrar";
    this.showModal = true;
  }

  onSave(): void {
    this.submitLoading = true;
    if (this.discountSelected) {
      this.discountService.updateDiscount(this.form.value).subscribe(
        data => {
          this.listDiscounts();
          this.showModal = false;
          this.dialogService.confirm(`Cupom salvo com sucesso.`);
        },
        () => (this.submitLoading = false)
      );
    } else {
      this.discountService.createDiscount(this.form.value).subscribe(
        data => {
          this.listDiscounts();
          this.showModal = false;
          this.dialogService.confirm(`Cupom salvo com sucesso.`);
        },
        () => (this.submitLoading = false)
      );
    }
  }

  onEdit(): void {
    this.showModal = true;
    this.buttonSubmitText = "Salvar";
    this.submitLoading = false;
    this.form.reset();
    this.discountService
      .getDiscount(this.discountSelected._id)
      .subscribe(data => {
        for (const controller of this.controllers) {
          if (controller === 'type'){
            +data['type'] === 1 ? this.prefix = '% ' : this.prefix = 'R$ ';
          }
          if (controller === 'expireDate'){
            data['expireDate'] = new Date(data['expireDate']).toISOString().split('T')[0];
          }
          this.form.controls[`${controller}`].setValue(data[`${controller}`]);
        }
      });
  }

  onDelete(): void {
    if (+localStorage.getItem("permission") !== PermissionEnum.owner) {
      this.dialogService.confirm(`Sem permissão para deletar um cupom`);
    } else {
      this.dialogService
        .confirm(`Deseja deletar o candidato ${this.discountSelected.name} ?`)
        .then((canDelete: boolean) => {
          if (canDelete) {
            this.discountService
              .deleteDiscount(this.discountSelected._id)
              .subscribe(() => {
                this.listDiscounts();
              });
          }
        });
    }
  }

  transformToCurrency(num: string): string {
    return `R$ ${parseFloat(num).toFixed(2)}`;
  }

  transformToPercentage(num: string): string {
    return `% ${parseFloat(num).toFixed(2)}`;
  }

  transformDiscountValueOnType(discount: Discount): string {
    if (+discount.type === DiscountTypeEnum.percentage)
      return this.transformToPercentage(discount.value.toString());
    if (+discount.type === DiscountTypeEnum.value)
      return this.transformToCurrency(discount.value.toString());
  }

  transformDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onChange(event): void {
    +event.target.value === 1 ? this.prefix = '% ' : this.prefix = 'R$ ';
  }
}
