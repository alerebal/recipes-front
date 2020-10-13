import { Component, OnInit, Input } from '@angular/core';

import { Product } from 'src/app/interfaces/Product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  ingredients: Product;
  userIngredients: Product;
  newIngredient = false;
  ingredientAdded = false;
  ingredientDeleted = false;
  ingredient: string;
  serverIngredients = true;

  constructor(
    private productService: ProductsService
  ) { }

  ngOnInit() {
    this.getProducts();
    this.getUserProducts();
  }

  // get the ingredients
  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.ingredients = res;
    });
  }

  getUserProducts() {
    const userId = localStorage.getItem('userId');
    this.productService.getUserProducts(userId).subscribe(res => {
    this.userIngredients = res;
    });
  }

  // if a product has been added
  onNewProduct(e: string) {
    this.getProducts();
    this.getUserProducts();
    this.newIngredient = false;
    this.ingredient = e;
    this.ingredientAdded = true;
    setTimeout(() => {
      this.ingredientAdded = false;
    }, 3000);
  }

  // delete a product
  onDelete(id: string, name: string) {
    if (confirm('Are you sure?')) {
      this.productService.deleteProduct(id).subscribe(
        res => {this.getProducts(),
          this.ingredient = name,
          this.ingredientDeleted = true,
          setTimeout(() => {
            this.ingredientDeleted = false;
          }, 3000);
        }
        , err => console.log(err));
    }
    return false;
  }

}
