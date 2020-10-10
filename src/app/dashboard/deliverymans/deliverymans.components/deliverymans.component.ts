import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Deliveryman } from 'src/app/models/deliveryman.model';
import { DialogService } from 'src/app/providers/dialog.service';
import { DeliverymanService } from 'src/app/providers/deliveryman.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PermissionEnum } from 'src/app/utils/enums/PermissionEnum';

@Component({
  selector: 'app-deliverymans',
  templateUrl: './deliverymans.component.html',
  styleUrls: ['./deliverymans.component.css']
})
export class DeliverymansComponent implements OnInit {
  deliverymans: Deliveryman[] = [];
  controllers: string[] = [];
  erro: string[] = [];
  deliverymanSelected: Deliveryman;
  showModal: boolean;
  form: FormGroup;
  submitLoading = false;
  buttonSubmitText: string;
  value: string;

  constructor(
    private deliverymanService: DeliverymanService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
    this.controllers = Object.keys(this.form.controls);
  }

  ngOnInit() {
    this.listDeliverymans();
  }

  listDeliverymans() {
    this.deliverymans = [];
    this.deliverymanService.getAllDeliverymans().subscribe((data: {}) => {
      // tslint:disable-next-line: forin
      for (const i in data) {
        this.deliverymans.push(data[i]);
      }
    });
  }

  onCreate(): void {
    this.form.reset();
    this.submitLoading = false;
    if (this.deliverymanSelected) {
      this.deliverymanSelected = null;
    }
    this.buttonSubmitText = 'Cadastrar';
    this.showModal = true;
  }

  onSave(): void {
    this.submitLoading = true;
    if (this.deliverymanSelected) {
      this.deliverymanService.updateDeliveryman(this.form.value).subscribe(
        data => {
          this.listDeliverymans();
          this.showModal = false;
          this.dialogService.confirm(`Entregador salvo com sucesso.`);
        },
        () => (this.submitLoading = false)
      );
    } else {
      this.deliverymanService.createDeliveryman(this.form.value).subscribe(
        data => {
          this.listDeliverymans();
          this.showModal = false;
          this.dialogService.confirm(`Entregador salvo com sucesso.`);
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
    this.deliverymanService
      .getDeliveryman(this.deliverymanSelected._id)
      .subscribe(data => {
        for (const controller of this.controllers) {
          this.form.controls[`${controller}`].setValue(data[`${controller}`]);
        }
      });
  }

  onDelete(): void {
    if (+localStorage.getItem('permission') !== PermissionEnum.owner) {
      this.dialogService.confirm(`Sem permissão para deletar um entregador`);
    } else {
      this.dialogService
        .confirm(`Deseja deletar o candidato ${this.deliverymanSelected.name} ?`)
        .then((canDelete: boolean) => {
          if (canDelete) {
            this.deliverymanService
              .deleteDeliveryman(this.deliverymanSelected._id)
              .subscribe(() => {
                this.listDeliverymans();
              });
          }
        });
    }
  }

}
