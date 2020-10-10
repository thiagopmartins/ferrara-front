import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliverymansComponent } from './deliverymans.components/deliverymans.component';

const routes: Routes = [{ path: '', component: DeliverymansComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliverymansRoutingModule {}
