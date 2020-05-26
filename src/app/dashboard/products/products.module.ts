import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgxMaskModule } from "ngx-mask";

import { ProductsComponent } from "./products.components/products.component";
import { ProductsRoutingModule } from "./products-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    ProductsRoutingModule,
    SharedModule,
    CurrencyMaskModule,
    NgxMaskModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class ProductsModule {}
