import { Component, OnInit } from "@angular/core";

import { Discount } from "src/app/models/discount.model";
import { DialogService } from "src/app/providers/dialog.service";
import { DiscountService } from "src/app/providers/discount.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { PermissionEnum } from "src/app/utils/enums/PermissionEnum";
import { DiscountTypeEnum } from "src/app/utils/enums/DiscountTypeEnum";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"]
})
export class OrdersComponent implements OnInit {
  form: FormGroup;

  constructor(
    private discountService: DiscountService,
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
    });
  }

  ngOnInit() {
  }
  panels = [
    {id: 1, open: true}, {id: 2, open: false}, {id:3, open: false}, {id: 4, open: false}
  ];

  panelChange(event, panel) {
    panel.open = event;
    if (event) {
      console.log('panel is opening');
    }
  }

}
