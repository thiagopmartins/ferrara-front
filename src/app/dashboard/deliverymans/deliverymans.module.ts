import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { DeliverymansComponent } from './deliverymans.components/deliverymans.component';
import { DeliverymansRoutingModule } from './deliverymans-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [DeliverymansComponent],
  imports: [
    DeliverymansRoutingModule,
    SharedModule,
    CurrencyMaskModule,
    NgxMaskModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DeliverymansModule {}
