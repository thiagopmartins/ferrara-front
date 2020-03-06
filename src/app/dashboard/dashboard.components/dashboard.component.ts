import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
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
    this.title = "Clientes";
    titlePage.setTitle("Ferrara - Gestor de Pedidos");

    this.userName =
      localStorage.getItem("user") === (undefined || null)
        ? "Não logado"
        : localStorage.getItem("user");
  }

  ngOnInit() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log(token);
    if (
      token === undefined ||
      user === undefined ||
      token === null ||
      user === null
    ) {
      this.router.navigate(["login"]);
    }

    this.options = [
      {
        title: "Clientes",
        icon: "user",
        link: "./clientes"
      }
    ];
  }

  logout() {
    localStorage.clear();
  }
}
