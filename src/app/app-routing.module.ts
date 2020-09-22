import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { HomeComponent } from './components/home/home.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { RecipeViewComponent } from './components/recipe-view/recipe-view.component';
import { RecipeEditComponent } from './components/recipe-edit/recipe-edit.component';


const routes: Routes = [
  {path: 'recipeForm', component: RecipeFormComponent},
  {path: '', component: HomeComponent},
  {path: 'recipes', component: RecipesComponent},
  {path: 'recipeView/:id', component: RecipeViewComponent},
  {path: 'recipeEdit/:id', component: RecipeEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
