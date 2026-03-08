import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onLogin(loginForm: NgForm){
    if(loginForm.valid){
      console.log('Form data: ', loginForm.value);
      loginForm.resetForm();
      this.router.navigateByUrl('/home');
    }
  }
}
