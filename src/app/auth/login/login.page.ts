import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoading = false;

  constructor(private router: Router, private authService: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async onLogin(loginForm: NgForm){
    if(!loginForm.valid){
      return;
    }

    const email = loginForm.value.email;
    const password = loginForm.value.password;

    this.isLoading = true;
    const loadingEl = await this.loadingCtrl.create({
      message: 'Logging in...',
    });
    await loadingEl.present();

    this.authService.logIn({email, password}).subscribe({
      next: () => {
        this.isLoading = false;
        loadingEl.dismiss();
        loginForm.resetForm();
        this.router.navigateByUrl('/home');
      },
      error: async (err) => {
        this.isLoading = false;
        loadingEl.dismiss();
        let message = 'Invalid email or password';
        const alert = await this.alertCtrl.create({
          header: 'Login failed',
          message: message,
          buttons: ['OK'],
        });
        await alert.present();

        loginForm.resetForm();
      },
    });
  }
}
