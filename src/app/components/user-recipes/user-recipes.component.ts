import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Recipe } from 'src/app/interfaces/Recipe';
import { User } from 'src/app/interfaces/User';
import { AuthService } from '../../services/auth.service';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.css']
})
export class UserRecipesComponent implements OnInit {

  userId: string;
  user: User;
  userRecipes: Recipe;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private recipeService: RecipesService
  ) { }

  ngOnInit() {
    this.getUserId();
    this.getUser(this.userId);
    this.getUserRecipes();
  }

  getUserId() {
    this.activatedRoute.params.subscribe(res => {
      this.userId = res.id;
      localStorage.setItem('userId', this.userId);
    });
  }

  getUser(id: string) {
    this.authService.getUser(id).subscribe(res => {
      this.user = res;
    });
  }

  getUserRecipes() {
    this.recipeService.getUserRecipes(this.userId).subscribe(res => {
      this.userRecipes = res;
    },
    err => {
      console.log(err);
    });
  }
}
