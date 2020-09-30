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
  newIngredient = true;
  ingredientAdded = false;
  ingredientDeleted = false;
  ingredient: string;

  constructor(
    private productService: ProductsService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  // get the ingredients
  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.ingredients = res;
    });
  }

  // if a product has been added
  onProductEdit(e: boolean) {
    if (e) {
      this.getProducts();
      this.newIngredient = false;
    }
  }

  onNewProduct(e: string) {
    this.ingredient = e;
    this.ingredientAdded = true;
  }

  // delete a product
  onDelete(id: string, name: string) {
    if (confirm('Are you sure?')) {
      this.productService.deleteProduct(id).subscribe(
        res => {this.getProducts(),
          this.ingredient = name,
          this.ingredientDeleted = true;
        }
        , err => console.log(err));
    }
    return false;
  }

}
