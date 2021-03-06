import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { ValidatorNumberDirective } from './directives/validator-number.directive';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { HomeComponent } from './components/home/home.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { RecipeViewComponent } from './components/recipe-view/recipe-view.component';
import { RecipeEditComponent } from './components/recipe-edit/recipe-edit.component';
import { ProductsComponent } from './components/products/products.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserRecipesComponent } from './components/user-recipes/user-recipes.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipeFormComponent,
    ValidatorNumberDirective,
    ProductFormComponent,
    HomeComponent,
    NavigationComponent,
    RecipesComponent,
    RecipeViewComponent,
    RecipeEditComponent,
    ProductsComponent,
    FooterComponent,
    SignInComponent,
    SignUpComponent,
    UserRecipesComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
