import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit{

  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(){
    this.username = this.authService.getUsername() || 'User';
  }
}
