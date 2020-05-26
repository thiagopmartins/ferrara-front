import { API_URL, handleError, HTTP_OPTIONS } from "../utils/utils";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product> {
    return this.http
      .get<Product>(API_URL + "/product/", {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  createProduct(product: Product): Observable<Product> {
    return this.http
      .post(API_URL + "/product/", product, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http
      .put(API_URL + "/product", product, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  deleteProduct(id: string): Observable<Product> {
    return this.http
      .delete(API_URL + `/product/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(0), catchError(handleError));
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(API_URL + `/product/${id}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }
}
