import { Token } from "./../models/token.model";
import { User } from "./../models/user.model";
import { HTTP_OPTIONS } from "./../utils/utils";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_URL, handleError } from "../utils/utils";
import { retry, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  getToken(name: string, password: string): Observable<Token> {
    const body: User = {
      name,
      password
    };

    return this.http
      .post<Token>(API_URL + "/session", JSON.stringify(body), HTTP_OPTIONS)
      .pipe(retry(1), catchError(handleError));
  }
}
