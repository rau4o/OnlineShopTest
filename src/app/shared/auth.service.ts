import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: any) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(tap(this.setToken));
  }

  logout() {
    this.setToken(null);
  }

  get token() {
    // @ts-ignore
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    // @ts-ignore
    return localStorage.getItem('fb-token');
  }

  private setToken(response: any) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token-exp', expDate.toString());
      localStorage.setItem('fb-token', response.idToken);
    } else {
      localStorage.clear();
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}
