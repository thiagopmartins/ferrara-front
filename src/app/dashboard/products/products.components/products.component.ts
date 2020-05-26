import { Component, OnInit } from "@angular/core";

import { Product } from "src/app/models/product.model";
import { DialogService } from "src/app/providers/dialog.service";
import { ProductService } from "src/app/providers/product.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { PermissionEnum } from "src/app/utils/enums/PermissionEnum";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  controllers: string[] = [];
  erro: string[] = [];
  productSelected: Product;
  showModal: boolean;
  form: FormGroup;
  submitLoading: boolean = false;
  buttonSubmitText: string;
  value: string;

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      _id: [],
      name: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      price: [Validators.required],
    });
    this.controllers = Object.keys(this.form.controls);
  }

  ngOnInit() {
    this.listProducts();
  }

  listProducts() {
    this.products = [];
    this.productService.getAllProducts().subscribe((data: {}) => {
      for (const i in data) {
        this.products.push(data[i]);
      }
    });
  }

  onCreate(): void {
    this.form.reset();
    this.submitLoading = false;
    if (this.productSelected) {
      this.productSelected = null;
    }
    this.buttonSubmitText = "Cadastrar";
    this.showModal = true;
  }

  onSave(): void {
    this.submitLoading = true;
    if (this.productSelected) {
      this.productService.updateProduct(this.form.value).subscribe(
        data => {
          this.listProducts();
          this.showModal = false;
          this.dialogService.confirm(`Produto salvo com sucesso.`);
        },
        () => (this.submitLoading = false)
      );
    } else {
      this.productService.createProduct(this.form.value).subscribe(
        data => {
          this.listProducts();
          this.showModal = false;
          this.dialogService.confirm(`Produto salvo com sucesso.`);
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
    this.productService
      .getProduct(this.productSelected._id)
      .subscribe(data => {
        for (const controller of this.controllers) {
          this.form.controls[`${controller}`].setValue(data[`${controller}`]);
        }
      });
  }

  onDelete(): void {
    if (+localStorage.getItem("permission") !== PermissionEnum.owner) {
      this.dialogService.confirm(`Sem permissão para deletar um produto`);
    } else {
      this.dialogService
        .confirm(`Deseja deletar o candidato ${this.productSelected.name} ?`)
        .then((canDelete: boolean) => {
          if (canDelete) {
            this.productService
              .deleteProduct(this.productSelected._id)
              .subscribe(() => {
                this.listProducts();
              });
          }
        });
    }
  }
}
