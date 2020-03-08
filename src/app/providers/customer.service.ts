import { API_URL, handleError, HTTP_OPTIONS } from "./../utils/utils";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { Customer } from "../models/customer.model";

@Injectable({
  providedIn: "root"
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer> {
    return this.http
      .get<Customer>(API_URL + "/customer/", {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http
      .post(API_URL + "/customer/", customer, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http
      .put(API_URL + "/customer", customer, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  deleteCustomer(id: string): Observable<Customer> {
    return this.http
      .delete(API_URL + `/customer/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(0), catchError(handleError));
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http
      .get<Customer>(API_URL + `/customer/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }
}
