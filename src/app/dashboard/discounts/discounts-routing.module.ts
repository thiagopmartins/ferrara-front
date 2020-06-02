import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DiscountsComponent } from "./discounts.components/discounts.component";

const routes: Routes = [{ path: "", component: DiscountsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountsRoutingModule {}
