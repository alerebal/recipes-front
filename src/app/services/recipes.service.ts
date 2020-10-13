import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Recipe } from '../interfaces/Recipe';
import { global } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

    url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = global.url;
   }

  getRecipes() {
    return this.http.get<Recipe>(`${this.url}recipes`);
  }

  getRecipe(id: string) {
    return this.http.get<Recipe>(`${this.url}recipe/${id}`);
  }

  getUserRecipes(id: string) {
    return this.http.get<Recipe>(`${this.url}userRecipes/${id}`);
  }

  addRecipe(recipe: any, ingredients: any, image: string) {
    return this.http.post<Recipe>(`${this.url}recipe`, {recipe, ingredients, image});
  }

  addPhoto(image: File) {
    const fd = new FormData();
    fd.append('image', image);

    return this.http.post(`${this.url}addPhoto`, fd);
  }

  deletePhoto(imageId: string) {
    return this.http.delete(`${this.url}deletePhoto/${imageId}`);
  }

  editRecipe(id: string, recipe: any) {
    return this.http.put(`${this.url}recipeEdit/${id}`, recipe);
  }

  deleteRecipe(id: string) {
    return this.http.delete(`${this.url}recipeDelete/${id}`);
  }


}
