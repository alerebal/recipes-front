import { Component, OnInit } from '@angular/core';

import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../interfaces/Recipe';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  recipes: Recipe;

  constructor(
    private recipeService: RecipesService
  ) { }

  ngOnInit() {
    this.getRecipes();
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(res => {
      this.recipes = res;
    });
  }

}
