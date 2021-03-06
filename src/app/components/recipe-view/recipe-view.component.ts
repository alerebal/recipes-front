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
  servings: number;
  isUserRecipe: boolean;

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

  // get a recipe
  getRecipe() {
    this.recipeService.getRecipe(this.id).subscribe(res => {
      this.recipe = res;
      this.servings = res.servings;
      const userId = localStorage.getItem('userId');
      const recipeUserId = res.userId;
      if (userId === recipeUserId) {
        this.isUserRecipe = true;
      } else {
        this.isUserRecipe = false;
      }
    });
  }

  // link to edit form
  editRecipe(id: string) {
    this.router.navigate([`/recipeEdit/${id}`]);
  }

  // delete recipe
  deleteRecipe(id: string) {
    if (confirm('Are you sure?')) {
      this.recipeService.deleteRecipe(id).subscribe(
        res => {
          this.router.navigate(['/userRecipes']);
        },
        err => console.log(err)
        );
    }
  }

  copyRecipe() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return this.router.navigate(['/signIn']);
    }

    this.recipeService.copyRecipe(this.recipe, userId).subscribe(res => {
      this.router.navigate(['userRecipes']);
    },
    err => console.log(err));
  }

  // change servings
  servingsChange(e: number) {
    this.servings = Number(e);
  }

}
