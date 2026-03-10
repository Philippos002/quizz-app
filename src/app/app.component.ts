import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent{

  get isLoggedIn(): boolean{
    return this.authService.isUserAuthenticated;
  }

  constructor(private menu: MenuController, private authService: AuthService, private router: Router) {

  }

  closeMenu(){
    this.menu.close();
  }

  logout(){
    this.authService.logOut();
    this.menu.close();
    this.router.navigateByUrl('/login');
  }
}
