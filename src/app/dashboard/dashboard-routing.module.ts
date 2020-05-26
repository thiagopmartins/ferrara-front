import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DashboardComponent } from "./dashboard.components/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "/dashboard/clientes", pathMatch: "full" },
      {
        path: "clientes",
        loadChildren: "./customers/customers.module#CustomersModule",
        data: {
          title: 'Clientes'
        }
      },
      {
        path: "produtos",
        loadChildren: "./products/products.module#ProductsModule",
        data: {
          title: 'Produtos'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
