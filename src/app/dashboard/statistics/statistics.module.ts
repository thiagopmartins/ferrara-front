import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

import { StatisticsComponent } from './statistics.components/statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    StatisticsRoutingModule,
    SharedModule,
    CurrencyMaskModule,
    NgxMaskModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class StatisticsModule {}
