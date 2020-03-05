import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { NgxMaskModule } from "ngx-mask";

import { CustomersComponent } from "./customers.components/customers.component";
import { CustomersRoutingModule } from "./customers-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ToDecimalPipe } from "src/app/pipes/to-decimal.pipe";

@NgModule({
  declarations: [CustomersComponent, ToDecimalPipe],
  imports: [CustomersRoutingModule, SharedModule, NgxMaskModule.forChild()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CurrencyPipe]
})
export class CustomersModule {}
