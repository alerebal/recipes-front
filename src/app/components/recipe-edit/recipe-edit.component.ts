import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { RecipesService } from '../../services/recipes.service';
import { ProductsService } from '../../services/products.service';
import { Recipe } from 'src/app/interfaces/Recipe';
import { Product } from 'src/app/interfaces/Product';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipe: Recipe;
  ingredients: any;
  ingredientsList: any = [];
  preparation: string[];
  ingredient: Product;
  ingreServerList: Product;
  productEdit = false;
  image: File;
  photoSelected: string | ArrayBuffer;
  photoResponse: any;
  msg: string;

  editForm = this.fb.group({
    ingreServer: this.fb.array([]),
  });


  ingreServer = this.editForm.get('ingredients') as FormArray;


  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipesService,
    private productService: ProductsService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.recipeService.getRecipe(res.id).subscribe(item => {
        this.recipe = item;
        this.ingredientsList = item.ingredients;
        this.preparation = item.preparation;
        this.photoSelected = item.filePath;
      });
    });
    this.getProducts();
  }

  // get ingredients from API
  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.ingreServerList = res;
      this.ingredient = this.ingreServerList[0];
    });
  }

    // if a new ingredient has been added to the API
  newProductAdd(e: boolean) {
    if (e) {
      this.getProducts();
      this.productEdit = false;
    }
  }

  // edit a product of the list of ingredients
  onEdit(id: string, newWeight: number, kcal: number) {
    const weight = Number(newWeight);
    kcal = Number(kcal);
    this.ingredientsList[id][1] = weight;
    this.ingredientsList[id][2] = (weight * kcal) / 100;
  }

  // remove a product of the list of ingredients
  onDelete(id: string) {
    this.ingredientsList.splice(id, 1);
  }

  // add a product to the list of ingredients
  addIngredient(weight: number) {
    if (weight === undefined || weight === null  || weight <= 0) {
      this.msg = 'Weight must be filled';
    } else if (isNaN(weight) === false ) {
      weight = Number(weight);
      const kcalTot = (weight * this.ingredient.kcal) / 100;
      this.ingredientsList.push([this.ingredient, weight, kcalTot]);
      this.msg = '';
    } else {
      this.msg = 'Weight must be a number';
    }

  }

  // when a paragraph has been modificated
  changePara(prepa: string, i: string) {
    this.preparation[i] = prepa;
  }

  // photo selected
  onPhotoSelected(e: HtmlInputEvent): void {
    if (e.target.files && e.target.files[0]) {
      this.image = e.target.files[0] as File;
      const reader = new FileReader();
      reader.onload = event => this.photoSelected = reader.result;
      reader.readAsDataURL(this.image);
    }
  }

  // submit
  onSubmit(name: string, servings: number, id: string) {
    if (this.image) {
      this.recipeService.addPhoto(this.image).subscribe(res => {
        this.recipeService.deletePhoto(this.recipe.fileId).subscribe();
        this.photoResponse = res;
        this.recipeService.editRecipe(id , {name, servings, ingredients: this.ingredientsList,
          preparation: this.preparation,
          kcalTot: this.kcalTot,
          filePath: this.photoResponse.image, fileId: this.photoResponse.imageId}).subscribe(res2 => {
            console.log(res2);
            this.router.navigate(['/recipes']);
          }
          );
      });

    } else {
      this.recipeService.editRecipe(id, {name, servings, ingredients: this.ingredientsList,
      preparation: this.preparation, kcalTot: this.kcalTot,
      filePath: this.recipe.filePath, fileId: this.recipe.fileId}).subscribe(res3 => {
        console.log(res3);
        this.router.navigate(['/recipes']);
      });
    }
  }

  get kcalTot() {
    const kcal = this.ingredientsList.map(item => item[2]).reduce((acc, val) => acc + val);
    const weight = this.ingredientsList.map(item => item[1]).reduce((acc, val) => acc + val);
    const kcalTot = ((kcal * 100) / weight).toFixed(2);
    return kcalTot;
  }

}
