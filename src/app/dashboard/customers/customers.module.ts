import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgxMaskModule } from "ngx-mask";

import { CustomersComponent } from "./customers.components/customers.component";
import { CustomersRoutingModule } from "./customers-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  declarations: [CustomersComponent],
  imports: [
    CustomersRoutingModule,
    SharedModule,
    CurrencyMaskModule,
    NgxMaskModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class CustomersModule {}
