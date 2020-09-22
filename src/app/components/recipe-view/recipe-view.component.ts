import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecipesService } from '../../services/recipes.service';
import { Recipe } from 'src/app/interfaces/Recipe';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {

  id: string;
  recipe: Recipe;

  constructor(
    private activatedRouter: ActivatedRoute,
    private recipeService: RecipesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRouter.params.subscribe(res => {
      this.id = res.id;
    });
    this.getRecipe();
  }

  getRecipe() {
    this.recipeService.getRecipe(this.id).subscribe(res => {
      this.recipe = res;
    });
  }

  editRecipe(id: string) {
    this.router.navigate([`/recipeEdit/${id}`]);
  }

  deleteRecipe(id: string) {
    this.recipeService.deleteRecipe(id).subscribe();
  }

}
