import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductsService } from '../../services/products.service';
import { RecipesService } from '../../services/recipes.service';
import { HelpersService } from '../../services/helpers.service';
import { Product } from '../../interfaces/Product';
import { validatorNumber } from 'src/app/directives/validator-number.directive';
import { invalid } from '@angular/compiler/src/render3/view/util';


interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {

  // form to add new recipe
  recipeForm = this.fb.group({
    name: this.fb.control('', Validators.required),
    weight: this.fb.control('', [Validators.required , validatorNumber(/[^0-9]/)]),
    servings: this.fb.control('', validatorNumber(/[^0-9]/)),
    preparation: this.fb.control('', Validators.required),
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
  listIngreEmpty = true;

  constructor(
    private productService: ProductsService,
    private recipeService: RecipesService,
    private fb: FormBuilder,
    private helper: HelpersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  // get ingredients - (ingredients = products in API)
  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.ingredients = res;
      this.ingredient = this.ingredients[0];
    });
  }

  // add an ingredient
  addProduct() {
    const weight = Number(this.recipeForm.value.weight);
    const kcalTot = (weight * this.ingredient.kcal) / 100;
    if (weight) {
      this.listIngredients.push([this.ingredient, weight, kcalTot]);
      this.msg = '';
      this.listIngreEmpty = false;
    }
    if (!weight) {
      this.msg = 'Weight must be provided';
      return false;
    }
  }

  // remove a ingredient from the list of selected ingredients
  deleteIngreList(i: number) {
    this.listIngredients.splice(i, 1);
    if (this.listIngredients.length === 0) {
      this.listIngreEmpty = true;
    }
  }

  // if a new ingredient has been added to the API
  newProductAdd(e: boolean) {
    if (e) {
      this.getProducts();
      this.productEdit = false;
    }
  }

  // when a photo has been selected
  onPhotoSelected(event: HtmlInputEvent): void {
    if (event.target.files && event.target.files[0]) {
      this.image = event.target.files[0] as File;
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.image);
    }
  }

  // submit form
  onSubmit() {
    const recipeSend = this.recipeForm.value;
    const name = recipeSend.name;
    const servings = recipeSend.servings;
    const ingredients = this.listIngredients;
    const kcalTot = this.kcalTot;
    const preparation = this.helper.splitter(this.recipeForm.value.preparation);
    if (this.image) {
      let image: any;
      this.recipeService.addPhoto(this.image).subscribe(res => {
        image = res;
        this.recipeService.addRecipe({name, servings, preparation, kcalTot}, ingredients, image).subscribe(res2 => {
          this.router.navigate(['/recipes']);
        },
        err => console.log(err));
      }
      );

    }
    if (!this.image) {
      this.recipeService.addRecipe({name, servings, preparation, kcalTot}, ingredients, null).subscribe(res => {
        this.router.navigate(['/recipes']);
      },
      err => console.log(err));
    }
    this.listIngredients = [];
    this.recipeForm.reset();
    this.photoSelected = 'assets/no-image-icon.png';
  }


  get name() { return this.recipeForm.get('name'); }

  get weight() { return this.recipeForm.get('weight'); }

  get servings() { return this.recipeForm.get('servings'); }

  get preparation() { return this.recipeForm.get('preparation'); }

  get kcalTot() {
    const kcal = this.listIngredients.map(item => item[2]).reduce((acc, val) => acc + val);
    const weight = this.listIngredients.map(item => item[1]).reduce((acc, val) => acc + val);
    const kcalTot = ((kcal * 100) / weight).toFixed(2);
    return kcalTot;
  }

}
