import { Component, HostBinding, OnInit } from '@angular/core';
import { animate, trigger, transition, style, stagger, query} from '@angular/animations';


import { Recipe } from 'src/app/interfaces/Recipe';
import { User } from 'src/app/interfaces/User';
import { AuthService } from '../../services/auth.service';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.css'],
  animations: [
    trigger('showing', [
      transition('* => *', [
          query('.card', [
            style({opacity: 0, transform: 'translateY(100%)'}),
          stagger(300, [animate('1s ease-in-out', style({opacity: 1, transform: 'none'}))])
          ], {optional: true})
      ])
    ])
  ]
})
export class UserRecipesComponent implements OnInit {

  @HostBinding('@showing')
  userId: string;
  user: User;
  userRecipes: Recipe;

  constructor(
    private authService: AuthService,
    private recipeService: RecipesService
  ) { }

  ngOnInit() {
    this.getUserId();
    this.getUser(this.userId);
    this.getUserRecipes();
  }

  getUserId() {
    this.userId = localStorage.getItem('userId');
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
