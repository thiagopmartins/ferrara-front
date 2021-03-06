import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.components/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: '/dashboard/clientes', pathMatch: 'full' },
      {
        path: 'clientes',
        loadChildren: './customers/customers.module#CustomersModule',
        data: {
          title: 'Clientes'
        }
      },
      {
        path: 'produtos',
        loadChildren: './products/products.module#ProductsModule',
        data: {
          title: 'Produtos'
        }
      },
      {
        path: 'cupons',
        loadChildren: './discounts/discounts.module#DiscountsModule',
        data: {
          title: 'Cupons'
        }
      },
      {
        path: 'entregadores',
        loadChildren: './deliverymans/deliverymans.module#DeliverymansModule',
        data: {
          title: 'Entregadores'
        }
      },
      {
        path: 'pedidos',
        loadChildren: './orders/orders.module#OrdersModule',
        data: {
          title: 'Pedidos'
        }
      },
      {
        path: 'producao',
        loadChildren: './request/requests.module#RequestsModule',
        data: {
          title: 'Produção'
        }
      },
      {
        path: 'estatisticas',
        loadChildren: './statistics/statistics.module#StatisticsModule',
        data: {
          title: 'Estatisticas'
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
