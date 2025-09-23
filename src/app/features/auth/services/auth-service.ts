import { ILoginResponse, IUsuario } from './../models/user.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<IUsuario | null>;
  public currentUser: Observable<IUsuario | null>;

  private httpClient = inject(HttpClient)
  apiUrl = `${environment.API_BASE}/usuarios`

  constructor() {
    this.currentUserSubject = new BehaviorSubject<IUsuario | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUsuario | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<ILoginResponse> {
    return this.httpClient.get<IUsuario[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(users => {
          if (users && users.length > 0) {
            const user = users[0];
            // Guardar usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            return {
              success: true,
              message: 'Login exitoso',
              user: user,
              token: 'fake-jwt-token-' + user.id
            };
          } else {
            return {
              success: false,
              message: 'Credenciales inválidas'
            };
          }
        })
      );
  }


  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

}
