import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Title } from "@angular/platform-browser";
import { AuthenticationService } from "src/app/providers/authentication.service";
import { Router } from "@angular/router";
import { Token } from "src/app/models/token.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitLoading: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router,
    private titlePage: Title
  ) {
    titlePage.setTitle("Conectar-se a Gestor de Pedidos");
  }

  ngOnInit() {
    this.form = this.fb.group({
      user: ["", Validators.required],
      password: ["", Validators.required]
    });

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log(token);
    if (
      token !== undefined &&
      user !== undefined &&
      token !== null &&
      user !== null
    ) {
      this.router.navigate(["dashboard"]);
    }
  }

  onLogin(): void {
    this.submitLoading = true;
    let userName = this.form.controls["user"].value;
    let password = this.form.controls["password"].value;
    this.authenticationService
      .getToken(userName, password)
      .subscribe((data: Token) => {
        this.router.navigate(["dashboard"]);
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", userName);
      })
      .add(() => {
        this.submitLoading = false;
      });
  }
}
