import { API_URL, handleError, HTTP_OPTIONS } from '../utils/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Discount } from '../models/discount.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  constructor(private http: HttpClient) {}

  getAllValidDiscounts(): Observable<Discount> {
    return this.http
      .get<Discount>(API_URL + '/discount/valid', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  getAllDiscounts(): Observable<Discount> {
    return this.http
      .get<Discount>(API_URL + '/discount/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  createDiscount(discount: Discount): Observable<Discount> {
    return this.http
      .post(API_URL + '/discount/', discount, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  updateDiscount(discount: Discount): Observable<Discount> {
    return this.http
      .put(API_URL + '/discount', discount, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  deleteDiscount(id: string): Observable<Discount> {
    return this.http
      .delete(API_URL + `/discount/${id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(0), catchError(handleError));
  }

  getDiscount(id: string): Observable<Discount> {
    return this.http
      .get<Discount>(API_URL + `/discount/${id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }
}
