import { API_URL, handleError, HTTP_OPTIONS } from '../utils/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    return this.http
      .post(API_URL + '/order/', order, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }
  getAllOrders(): Observable<Order> {
    return this.http
      .get<Order>(API_URL + '/order/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }
  updateOrder(product: Order): Observable<Order> {
    return this.http
      .put(API_URL + '/order', product, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }
}
