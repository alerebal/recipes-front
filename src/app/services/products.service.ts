import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators'; // borre retry

import { global } from '../global';
import { Product } from '../interfaces/Product';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = global.url;
   }

  getProducts() {
    return this.http.get<Product>(`${this.url}products`);
  }

  createProduct(product: Product) {
    return this.http.post<Product>(`${this.url}product`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.url}deleteIngredient/${id}`);
  }
}
