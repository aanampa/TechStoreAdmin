import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { IUsuario } from '../../../auth/models/user.model';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);

  currentUser: IUsuario | null = null;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
  }
}
