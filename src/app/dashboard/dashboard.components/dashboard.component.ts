import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title: String;
  options: any[] = [];
  userName: string;
  collapsed: boolean;

  constructor(
    private activiteRouter: ActivatedRoute,
    private router: Router,
    private titlePage: Title
  ) {
    titlePage.setTitle('Ferrara - Gestor de Pedidos');

    this.userName =
      localStorage.getItem('user') === (undefined || null)
        ? 'Não logado'
        : localStorage.getItem('user');

    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        console.log(this.activiteRouter.firstChild);
        this.title = this.activiteRouter.firstChild.data['value'].title;
      }
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (
      token === undefined ||
      user === undefined ||
      token === null ||
      user === null
    ) {
      this.router.navigate(['login']);
    }

    this.options = [
      {
        title: 'Clientes',
        icon: 'user',
        link: './clientes'
      },
      {
        title: 'Produtos',
        icon: 'shopping-bag',
        link: './produtos'
      },
      {
        title: 'Cupons',
        icon: 'tags',
        link: './cupons'
      },
      {
        title: 'Pedidos',
        icon: 'shopping-cart',
        link: './pedidos'
      }
    ];
  }

  logout() {
    localStorage.clear();
  }
}
