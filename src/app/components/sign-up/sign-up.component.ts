import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    name: this.fb.control('', Validators.required),
    password: this.fb.control('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: this.fb.control('', [Validators.required, Validators.minLength(4)])
  });

  errorMsg: string;
  errorServer: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    const form = this.signUpForm.value;
    const password = form.password;
    const confirm = form.confirmPassword;

    if (password !== confirm) {
      this.errorMsg = 'Password do not match';
      setTimeout(() => {
        this.errorMsg = '';
      }, 3000);
    } else {
      const user = {
        email: form.email,
        name: form.name,
        password: form.password
      };
      this.authService.signUp(user).subscribe(res => {
        const id = res.newUser._id;
        localStorage.setItem('token', res.token);
        this.router.navigate([`userRecipes/${id}`]);
      },
      err => {
        this.errorServer = err.error.message;
        setTimeout(() => {
          this.errorServer = '';
        }, 3000);
      });
    }
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get name() {
    return this.signUpForm.get('name');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

}
