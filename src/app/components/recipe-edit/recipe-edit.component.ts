import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  // edit = false;
  productEdit = false;
  image: File;
  photoSelected: string | ArrayBuffer;
  photoResponse: any;

  editForm = this.fb.group({
    // name: this.fb.control(''),
    // weight: this.fb.control(''),
    ingreServer: this.fb.array([])
  });


  ingreServer = this.editForm.get('ingredients') as FormArray;


  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipesService,
    private productService: ProductsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.recipeService.getRecipe(res.id).subscribe(item => {
        this.recipe = item;
        // this.ingredients = item.ingredients;
        this.ingredientsList = item.ingredients;
        this.preparation = item.preparation;
        this.photoSelected = item.filePath;
      });
    });
    this.getProducts();
  }


  getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.ingreServerList = res;
      this.ingredient = this.ingreServerList[0];
    });
  }

  newProductAdd(e: boolean) {
    if (e) {
      this.getProducts();
      this.productEdit = false;
    }
  }

  onEdit(id: string, newWeight: number, kcal: number) {
    const weight = Number(newWeight);
    kcal = Number(kcal);
    this.ingredientsList[id][1] = weight;
    this.ingredientsList[id][2] = (weight * kcal) / 100;
  }

  onDelete(id: string) {
    this.ingredientsList.splice(id, 1);
  }

  addIngredient(weight: number) {
    weight = Number(weight);
    const kcalTot = (weight * this.ingredient.kcal) / 100;
    this.ingredientsList.push([this.ingredient, weight, kcalTot]);
  }

  changePara(prepa: string, i: string) {
    this.preparation[i] = prepa;
  }

  onPhotoSelected(e: HtmlInputEvent): void {
    if (e.target.files && e.target.files[0]) {
      this.image = e.target.files[0] as File;
      const reader = new FileReader();
      reader.onload = event => this.photoSelected = reader.result;
      reader.readAsDataURL(this.image);
    }
  }

  onSubmit(name: string, id: string) {
    if (this.image) {
      this.recipeService.addPhoto(this.image).subscribe(res => {
        this.recipeService.deletePhoto(this.recipe.fileId).subscribe();
        this.photoResponse = res;
        this.recipeService.editRecipe(id , {name, ingredients: this.ingredientsList,
          preparation: this.preparation,
          kcalTot: this.kcalTot,
          filePath: this.photoResponse.image, fileId: this.photoResponse.imageId}).subscribe();
      });

    } else {
      this.recipeService.editRecipe(id, {name, ingredients: this.ingredientsList, preparation: this.preparation, kcalTot: this.kcalTot,
      filePath: this.recipe.filePath, fileId: this.recipe.fileId}).subscribe();
    }
  }

  get kcalTot() {
    const kcal = this.ingredientsList.map(item => item[2]).reduce((acc, val) => acc + val);
    const weight = this.ingredientsList.map(item => item[1]).reduce((acc, val) => acc + val);
    const kcalTot = (kcal * 100) / weight;
    return kcalTot;
  }

}
