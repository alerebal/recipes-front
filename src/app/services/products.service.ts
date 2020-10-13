import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  getUserProducts(id: string) {
    return this.http.get<Product>(`${this.url}products/${id}`);
  }

  getAllProducts(id: string) {
    return this.http.get<Product>(`${this.url}allProducts/${id}`);
  }

  createProduct(product: Product) {
    return this.http.post<Product>(`${this.url}product`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.url}product/${id}`);
  }
}
