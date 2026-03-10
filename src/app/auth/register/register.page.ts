import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  isLoading = false;

  constructor(private router: Router, private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async onRegister(registerForm: NgForm){
    if(!registerForm.valid){
      return;
    }

    const username = registerForm.value.username;
    const email = registerForm.value.email;
    const password = registerForm.value.password;

    this.isLoading = true;
    const loadingEl = await this.loadingCtrl.create({
      message: 'Creating account...',
    });
    await loadingEl.present();

    this.authService.register({username, email, password}).subscribe({
      next: () => {
        this.isLoading = false;
        loadingEl.dismiss();
        registerForm.resetForm();
        this.router.navigateByUrl('/login');
      },
      error: async (err) => {
        this.isLoading = false;
        loadingEl.dismiss();
        let message = 'Registration failed';
        
        if(err.error.error.message === 'EMAIL_EXISTS'){
          message = 'Email already exists';
        }

        const alert = await this.alertCtrl.create({
          header: 'Registration failed',
          message: message,
          buttons: ['OK'],
        });
        await alert.present();

        registerForm.resetForm();
      },
    });
  }

}
