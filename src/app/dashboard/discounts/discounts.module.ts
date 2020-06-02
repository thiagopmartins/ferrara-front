import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgxMaskModule } from "ngx-mask";

import { DiscountsComponent } from "./discounts.components/discounts.component";
import { DiscountsRoutingModule } from "./discounts-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  declarations: [DiscountsComponent],
  imports: [
    DiscountsRoutingModule,
    SharedModule,
    CurrencyMaskModule,
    NgxMaskModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DiscountsModule {}
