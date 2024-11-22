import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
  isLogin = true;
  isForgotPassword = false;
  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  resetForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = 'none';
    }
  }

  ionViewWillLeave() {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = 'flex';
    }
  }

  initializeForm() {
    if (this.isLogin) {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      }, { validator: this.passwordMatchValidator });
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
    this.isForgotPassword = false;
    this.initializeForm();
  }

  async authenticate() {
    if (this.authForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Por favor espera...',
        cssClass: 'custom-loading'
      });
      await loading.present();

      try {
        const { email, password } = this.authForm.value;
        if (this.isLogin) {
          await this.authService.login(email, password);
        } else {
          if (password !== this.authForm.get('confirmPassword')?.value) {
            throw new Error('Las contraseñas no coinciden');
          }
          await this.authService.register(email, password);
        }
        await this.router.navigate(['/tabs/characters']);
        const toast = await this.toastCtrl.create({
          message: this.isLogin ? '¡Bienvenido!' : '¡Registro exitoso!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      } catch (error: any) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: error.message,
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      } finally {
        await loading.dismiss();
      }
    }
  }

  async resetPassword() {
    if (this.resetForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Enviando correo...',
        cssClass: 'custom-loading'
      });
      await loading.present();

      try {
        await this.authService.resetPassword(this.resetForm.get('email')?.value);
        const toast = await this.toastCtrl.create({
          message: 'Se ha enviado un correo para restablecer tu contraseña',
          duration: 3000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
        this.isForgotPassword = false;
        this.resetForm.reset();
      } catch (error: any) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: error.message,
          buttons: ['OK'],
          cssClass: 'custom-alert'
        });
        await alert.present();
      } finally {
        await loading.dismiss();
      }
    }
  }
}
