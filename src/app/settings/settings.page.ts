import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DragonBallService } from '../../services/dragonball.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Character } from '../interfaces/api.interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {
  user$ = this.authService.getUserState();
  characters: Character[] = [];
  selectedCharacter: Character | null = null;
  username: string = '';

  constructor(
    private authService: AuthService,
    private dragonBallService: DragonBallService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadCharacters();
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      this.username = savedUsername;
    }
  }

  async loadCharacters() {
    try {
      const response = await this.dragonBallService.getCharacters(1, 20).toPromise();
      this.characters = response?.items || [];
    } catch (error) {
      console.error('Error cargando personajes:', error);
    }
  }

  selectCharacter(character: Character) {
    this.selectedCharacter = character;
    localStorage.setItem('selectedCharacter', JSON.stringify(character));
  }

  updateUsername() {
    localStorage.setItem('username', this.username);
  }

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
