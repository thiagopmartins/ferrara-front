import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { OrdersComponent } from './orders.components/orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    OrdersRoutingModule,
    SharedModule,
    CurrencyMaskModule,
    NgxMaskModule.forChild(),
    NgxPrintModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class OrdersModule {}
