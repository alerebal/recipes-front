import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {

  signInForm = this.fb.group({
    email: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required)
  });

  @ViewChild('emailFocus', {static: false}) emailFocus: ElementRef;
  errorMsg: string;
  isError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.emailFocus.nativeElement.focus();
  }

  onSubmit() {
    const form = this.signInForm.value;
    const user = {
      email: form.email,
      password: form.password
    };
    this.authService.signIn(user).subscribe(res => {
      const id = res.user._id;
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', id);
      this.router.navigate([`userRecipes`]);
    },
    err => {
      this.errorMsg = err.error.message;
      this.isError = true;
      setTimeout(() => {
        this.isError = false;
      }, 3000);
    });
  }


}
