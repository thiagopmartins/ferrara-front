import { API_URL, handleError, HTTP_OPTIONS } from './../utils/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Deliveryman } from '../models/deliveryman.model';

@Injectable({
  providedIn: 'root'
})
export class DeliverymanService {
  constructor(private http: HttpClient) {}

  getAllDeliverymans(): Observable<Deliveryman[]> {
    return this.http
      .get<Deliveryman[]>(API_URL + '/deliveryman/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  createDeliveryman(deliveryman: Deliveryman): Observable<Deliveryman> {
    return this.http
      .post(API_URL + '/deliveryman/', deliveryman, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  updateDeliveryman(deliveryman: Deliveryman): Observable<Deliveryman> {
    return this.http
      .put(API_URL + '/deliveryman', deliveryman, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  deleteDeliveryman(id: string): Observable<Deliveryman> {
    return this.http
      .delete(API_URL + `/deliveryman/${id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(0), catchError(handleError));
  }

  getDeliveryman(id: string): Observable<Deliveryman> {
    return this.http
      .get<Deliveryman>(API_URL + `/deliveryman/${id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }

  resetDeliveryman(): Observable<Deliveryman> {
    return this.http
      .get<Deliveryman>(API_URL + `/deliveryman/reset`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      })
      .pipe(retry(1), catchError(handleError));
  }
}
