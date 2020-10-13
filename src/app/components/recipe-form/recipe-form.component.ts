import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  productEdited = false;
  listIngreEmpty = true;
  newIngredientName: string;
  successMsg = false;
  nameExists = false;
  noWeight = false;
  ingreAdded = false;

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


  getProducts() {
    const userId = localStorage.getItem('userId');
    this.productService.getAllProducts(userId).subscribe(res => {
      this.ingredients = res;
    });
  }


  // add an ingredient
  addProduct() {
    const weight = Number(this.recipeForm.value.weight);
    const kcalTot = (weight * this.ingredient.kcal) / 100;
    if (weight) {
      this.listIngredients.push([this.ingredient, weight, kcalTot]);
      // this.msg = '';
      this.listIngreEmpty = false;
      this.noWeight = false;
      this.ingreAdded = true;
      setTimeout(() => {
        this.ingreAdded = false;
      }, 3000);
    }
    if (!weight) {
      this.msg = 'Weight must be provided';
      this.noWeight = true;
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
  newProductAdd(e: string) {
    this.getProducts();
    this.newIngredientName = e;
    this.productEdited = false;
    this.successMsg = true;
    setTimeout(() => {
      this.successMsg = false;
    }, 3000);
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
    const userId = localStorage.getItem('userId');
    // recipe with image
    if (this.image) {
      let image: any;
      this.recipeService.addPhoto(this.image).subscribe(res => {
        image = res;
        this.recipeService.addRecipe({userId, name, servings, preparation, kcalTot}, ingredients, image).subscribe(res2 => {
          this.router.navigate([`/userRecipes/${userId}`]);
          this.nameExists = false;
        },
        // if the name already exists
        err => {
          this.msg = err.error.message;
          this.nameExists = true;
        });
      }
      );

    // without image
    }
    if (!this.image) {
      this.recipeService.addRecipe({userId, name, servings, preparation, kcalTot}, ingredients, null).subscribe(res => {
        this.router.navigate([`/userRecipes/${userId}`]),
        this.nameExists = false;
      },
      // if the name already exists
      err => {
        this.msg = err.error.message;
        this.nameExists = true;
      });
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
