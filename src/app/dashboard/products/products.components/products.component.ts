import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product.model';
import { DialogService } from 'src/app/providers/dialog.service';
import { ProductService } from 'src/app/providers/product.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PermissionEnum } from 'src/app/utils/enums/PermissionEnum';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  controllers: string[] = [];
  erro: string[] = [];
  productSelected: Product;
  showModal: boolean;
  form: FormGroup;
  submitLoading = false;
  buttonSubmitText: string;
  value: string;

  constructor(
    private productService: ProductService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0.00],
    });
    this.controllers = Object.keys(this.form.controls);
  }

  ngOnInit() {
    this.listProducts();
  }

  listProducts() {
    this.products = [];
    this.productService.getAllProducts().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
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
    this.buttonSubmitText = 'Cadastrar';
    this.showModal = true;
  }

  onSave(): void {
    this.submitLoading = true;
    this.form.value['price'] += this.getCategoryDefaultValue(this.form.value[`category`]);
    console.log(this.getCategoryDefaultValue(this.form.value[`category`]));
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
    this.buttonSubmitText = 'Salvar';
    this.submitLoading = false;
    this.form.reset();
    this.productService
      .getProduct(this.productSelected._id)
      .subscribe(data => {
        for (const controller of this.controllers) {
          if (controller === 'price') {
            data[`${controller}`] = data[`${controller}`] - this.getCategoryDefaultValue(data[`category`]);
          }
          this.form.controls[`${controller}`].setValue(data[`${controller}`]);
        }
      });
  }

  onDelete(): void {
    if (+localStorage.getItem('permission') !== PermissionEnum.owner) {
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

  transformToCurrency(num: string): string {
    return `R$ ${parseFloat(num).toFixed(2)}`;
  }

  getCategoryName(category): string {
    let name: string;
    switch (+category) {
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

  getCategoryDefaultValue(category): number {
    let value: number;
    switch (+category) {
      case 2: {
        value = 32.90;
        break;
      }
      case 3: {
        value = 47.90;
        break;
      }
      case 5: {
        value = 29.90;
        break;
      }
      default: {
        value = 0.00;
        break;
      }
    }
    return value;
  }
}
