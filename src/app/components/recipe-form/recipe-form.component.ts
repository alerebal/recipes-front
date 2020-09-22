import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { ProductsService } from '../../services/products.service';
import { RecipesService } from '../../services/recipes.service';
import { HelpersService } from '../../services/helpers.service';
import { Product } from '../../interfaces/Product';
import { validatorNumber } from 'src/app/directives/validator-number.directive';


interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {

  recipeForm = this.fb.group({
    name: this.fb.control('', Validators.required),
    weight: this.fb.control('', validatorNumber(/[^0-9]/)),
    preparation: this.fb.control(''),
    ingreServer: this.fb.array([])
  });

  ingreServer = this.recipeForm.get('ingreServer') as FormArray;

  ingredients: Product;
  listIngredients = [];
  ingredient: Product;
  prepa = [];
  msg = '';
  image: File;
  photoSelected: string | ArrayBuffer;
  productEdit = false;

  constructor(
    private productService: ProductsService,
    private recipeService: RecipesService,
    private fb: FormBuilder,
    private helper: HelpersService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  // ingredients = products
  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.ingredients = res;
      this.ingredient = this.ingredients[0];
    });
  }

  addProduct() {
    const weight = Number(this.recipeForm.value.weight);
    const kcalTot = (weight * this.ingredient.kcal) / 100;
    if (weight) {
      this.listIngredients.push([this.ingredient, weight, kcalTot]);
      this.msg = '';
    }
    if (!weight) {
      this.msg = 'weight must be provided';
      return false;
    }
  }

  newProductAdd(e: boolean) {
    if (e) {
      this.getProducts();
      this.productEdit = false;
    }
  }

  onPhotoSelected(event: HtmlInputEvent): void {
    if (event.target.files && event.target.files[0]) {
      this.image = event.target.files[0] as File;
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.image);
    }
  }


  onSubmit() {
    const recipeSend = this.recipeForm.value;
    const name = recipeSend.name;
    const ingredients = this.listIngredients;
    const kcalTot = this.kcalTot;
    const preparation = this.helper.splitter(this.recipeForm.value.preparation);
    if (this.image) {
      let image: any;
      this.recipeService.addPhoto(this.image).subscribe(res => {
        image = res;
        this.recipeService.addRecipe({name, preparation, kcalTot}, ingredients, image).subscribe(res2 => {
          console.log(res2);
        });
      }
      );

    }
    if (!this.image) {
      // console.log('no image');
      this.recipeService.addRecipe({name, preparation, kcalTot}, ingredients, null).subscribe(res => {
        console.log(res);
      });
    }
    this.listIngredients = [];
    this.recipeForm.reset();
    this.photoSelected = 'assets/no-image-icon.png';
  }

  get name() { return this.recipeForm.get('name'); }

  get weight() { return this.recipeForm.get('weight'); }

  get kcalTot() {
    const kcal = this.listIngredients.map(item => item[2]).reduce((acc, val) => acc + val);
    const weight = this.listIngredients.map(item => item[1]).reduce((acc, val) => acc + val);
    const kcalTot = (kcal * 100) / weight;
    return kcalTot;
  }

}
