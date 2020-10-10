import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signInForm = this.fb.group({
    email: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required)
  });

  errorMsg: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    const form = this.signInForm.value;
    const user = {
      email: form.email,
      password: form.password
    };
    this.authService.signIn(user).subscribe(res => {
      localStorage.setItem('token', res.token);
      this.router.navigate(['/userRecipes']);
    },
    err => {
      this.errorMsg = err.error.message;
      setTimeout(() => {
        this.errorMsg = '';
      }, 3000);
    });
  }

}
