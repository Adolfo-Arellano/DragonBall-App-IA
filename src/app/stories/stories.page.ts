import { Component } from '@angular/core';
import { DragonBallService } from '../../services/dragonball.service';
import { OpenaiService } from '../../services/openai.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Character } from '../interfaces/api.interfaces';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.page.html',
  styleUrls: ['./stories.page.scss'],
})

export class StoriesPage {
  characters: Character[] = [];
  selectedCharacters: Character[] = [];
  targetAge: number = 7;
  generatedStory: string = '';
  isLoading = false;

  constructor(
    private dragonBallService: DragonBallService,
    private openaiService: OpenaiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loadCharacters();
  }

  async loadCharacters() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando personajes...'
    });
    await loading.present();

    this.dragonBallService.getCharacters().subscribe(
      response => {
        this.characters = response.items;
        loading.dismiss();
      },
      error => {
        console.error('Error:', error);
        loading.dismiss();
        this.showError('Error al cargar los personajes');
      }
    );
  }

  async generateStory() {
    if (this.selectedCharacters.length === 0) {
      this.showError('Por favor, selecciona al menos un personaje');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Generando historia...'
    });
    await loading.present();

    this.openaiService.generateStory(this.selectedCharacters, this.targetAge).subscribe(
      response => {
        this.generatedStory = response.story;
        loading.dismiss();
      },
      error => {
        console.error('Error:', error);
        loading.dismiss();
        this.showError('Error al generar la historia');
      }
    );
  }

  toggleCharacterSelection(character: Character) {
    const index = this.selectedCharacters.findIndex(c => c.id === character.id);
    if (index === -1) {
      if (this.selectedCharacters.length < 3) {
        this.selectedCharacters.push(character);
      } else {
        this.showError('Máximo 3 personajes por historia');
      }
    } else {
      this.selectedCharacters.splice(index, 1);
    }
  }

  async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }
}
