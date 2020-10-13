import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../interfaces/User';
import { global } from '../global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.url = global.url;
  }

  signUp(user: User) {
    return this.http.post<any>(`${this.url}signUp`, user);
  }

  signIn(user: User) {
    return this.http.post<any>(`${this.url}signIn`, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  loggedOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/recipes']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.url}user/${id}`);
  }

}
