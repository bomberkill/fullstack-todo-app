import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  _id: string;
  name: string;
  email: string;
}
interface Credentials {
  name: string
  email: string;
  password: string;
}
// interface UserDetails {
//   id: string
//   email: string;
//   password: string;
//   token: string;
// }

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = '/api/auth';
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_NAME_KEY = 'authUserName';


  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: Omit<Credentials, "name">): Observable<Partial<AuthResponse> & {token: string}>{
    return this.http.post<Partial<AuthResponse> & {token: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        if (response.name) {
          localStorage.setItem(this.USER_NAME_KEY, response.name);
        }

      })
    );
  }

  register(userDetails: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userDetails).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        if (response.name) {
          localStorage.setItem(this.USER_NAME_KEY, response.name);
        }
      })
    );
  }

  getCurrentUserName(): string | null {
    return localStorage.getItem(this.USER_NAME_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    this.router.navigate(['/login']);
  }

}
