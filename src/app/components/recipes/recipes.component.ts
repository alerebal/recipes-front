import { Component, HostBinding, OnInit } from '@angular/core';
import { animate, trigger, transition, style, stagger, query} from '@angular/animations';

import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../interfaces/Recipe';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
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
export class RecipesComponent implements OnInit {

  @HostBinding('@showing')
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
