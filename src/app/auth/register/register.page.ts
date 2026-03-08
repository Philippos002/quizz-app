import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onRegister(registerForm: NgForm){
    if(registerForm.valid){
      console.log('Form data: ', registerForm.value);
      registerForm.resetForm();
      this.router.navigateByUrl('/login');
    }
  }

}
