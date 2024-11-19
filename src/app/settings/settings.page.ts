import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  user$ = this.authService.getUserState();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async logout() {
    try {
      await this.authService.logout();
      await this.router.navigate(['/tabs/auth']);
    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: error.message,
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}