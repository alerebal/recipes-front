import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { HomeComponent } from './components/home/home.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { RecipeViewComponent } from './components/recipe-view/recipe-view.component';
import { RecipeEditComponent } from './components/recipe-edit/recipe-edit.component';
import { ProductsComponent } from './components/products/products.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { UserRecipesComponent } from './components/user-recipes/user-recipes.component';

import { AuthGuard } from './auth.guard';



const routes: Routes = [
  {path: 'recipeForm', component: RecipeFormComponent},
  {path: '', component: HomeComponent},
  {path: 'recipes', component: RecipesComponent},
  {path: 'userRecipes/:id', component: UserRecipesComponent, canActivate: [AuthGuard]},
  {path: 'recipeView/:id', component: RecipeViewComponent},
  {path: 'recipeEdit/:id', component: RecipeEditComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'signUp', component: SignUpComponent},
  {path: 'signIn', component: SignInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
