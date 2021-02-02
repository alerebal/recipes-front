import { Component, HostBinding, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state, query, stagger, keyframes } from '@angular/animations';

import { Product } from 'src/app/interfaces/Product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  animations: [
    trigger('animeIngre', [
      transition('void => *', [
        query('.ingredient', [
          style({opacity: 0, transform: 'translateY(-30px)'}),
          stagger(50, animate('.5s', keyframes([
            style({opacity: .2, transform: 'translateY(-10px)'}),
            style({opacity: .6, transform: 'translateY(30px)'}),
            style({opacity: 1, transform: 'translateY(0px)'}),
          ])))
        ], {limit: 15, optional: true})
      ]),
    ])],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @HostBinding('@animeIngre')
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
        res => {
          this.getUserProducts(),
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
