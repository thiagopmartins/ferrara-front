import { Component, OnInit } from "@angular/core";

import { Customer } from "src/app/models/customer.model";
import { DialogService } from "src/app/providers/dialog.service";
import { CustomerService } from "src/app/providers/customer.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { PermissionEnum } from "src/app/utils/enums/PermissionEnum";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.css"]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  controllers: string[] = [];
  erro: string[] = [];
  customerSelected: Customer;
  showModal: boolean;
  form: FormGroup;
  submitLoading: boolean = false;
  buttonSubmitText: string;
  value: string;

  constructor(
    private customerService: CustomerService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      _id: [],
      name: ["", Validators.required],
      phone: ["", Validators.required],
      address: ["", Validators.required],
      dateOfBirth: [""],
      district: [""],
      number: [],
      block: [""],
      aptoBlock: [""],
      apto: [""],
      lot: [""],
      deliveryTax: [Validators.required],
      referencePoint: [""]
    });
    this.controllers = Object.keys(this.form.controls);
  }

  ngOnInit() {
    this.listCustomers();
  }

  listCustomers() {
    this.customers = [];
    this.customerService.getAllCustomers().subscribe((data: {}) => {
      for (const i in data) {
        this.customers.push(data[i]);
      }
      console.log(this.customers);
    });
  }

  onCreate(): void {
    this.form.reset();
    this.submitLoading = false;
    if (this.customerSelected) {
      this.customerSelected = null;
    }
    this.buttonSubmitText = "Cadastrar";
    this.showModal = true;
  }

  onSave(): void {
    this.submitLoading = true;
    if (this.customerSelected) {
      console.log(this.form.value);
      this.customerService.updateCustomer(this.form.value).subscribe(
        data => {
          this.listCustomers();
          this.showModal = false;
          console.log(data);
          this.dialogService.confirm(`Cliente salvo com sucesso.`);
        },
        () => (this.submitLoading = false)
      );
    } else {
      console.log(this.form.value);
      this.customerService.createCustomer(this.form.value).subscribe(
        data => {
          this.listCustomers();
          this.showModal = false;
          console.log(data);
          this.dialogService.confirm(`Cliente salvo com sucesso.`);
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
    this.customerService
      .getCustomer(this.customerSelected._id)
      .subscribe(data => {
        for (const controller of this.controllers) {
          this.form.controls[`${controller}`].setValue(data[`${controller}`]);
        }
      });
  }

  onDelete(): void {
    if (+localStorage.getItem("permission") !== PermissionEnum.owner) {
      this.dialogService.confirm(`Sem permissão para deletar um cliente`);
    } else {
      this.dialogService
        .confirm(`Deseja deletar o candidato ${this.customerSelected.name} ?`)
        .then((canDelete: boolean) => {
          if (canDelete) {
            this.customerService
              .deleteCustomer(this.customerSelected._id)
              .subscribe(() => {
                this.listCustomers();
              });
          }
        });
    }
  }
}
