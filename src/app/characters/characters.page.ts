import { Component, OnInit } from '@angular/core';
import { DragonBallService } from '../../services/dragonball.service';
import { LoadingController } from '@ionic/angular';
import { Character } from '../interfaces/api.interfaces';

interface CharacterWithUI extends Character {
  showFullDescription: boolean;
}

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
})
export class CharactersPage implements OnInit {
  characters: CharacterWithUI[] = [];
  searchTerm: string = '';
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  constructor(
    private dragonBallService: DragonBallService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadCharacters();
  }

  getRaceColor(race: string): string {
    const raceColors: { [key: string]: string } = {
      'Saiyan': 'warning',
      'Human': 'primary',
      'Namekian': 'success',
      'Android': 'medium',
      'Majin': 'danger'
    };
    return raceColors[race] || 'primary';
  }

  async loadCharacters(event?: any) {
    if (!this.isLoading) {
      this.isLoading = true;
      
      const loading = await this.loadingCtrl.create({
        message: 'Cargando personajes...'
      });
      await loading.present();

      this.dragonBallService.getCharacters(this.currentPage).subscribe(
        (response) => {
          const newCharacters = response.items.map(char => ({
            ...char,
            showFullDescription: false
          }));
          
          if (event) {
            this.characters = [...this.characters, ...newCharacters];
          } else {
            this.characters = newCharacters;
          }
          
          this.totalPages = response.meta.totalPages;
          this.isLoading = false;
          loading.dismiss();
          
          if (event) {
            event.target.complete();
            if (this.currentPage >= this.totalPages) {
              event.target.disabled = true;
            }
          }
        },
        (error) => {
          console.error('Error:', error);
          this.isLoading = false;
          loading.dismiss();
          if (event) {
            event.target.complete();
          }
        }
      );
    }
  }

  loadMore(event: any) {
    this.currentPage++;
    this.loadCharacters(event);
  }

  async searchCharacters() {
    if (this.searchTerm.trim()) {
      const loading = await this.loadingCtrl.create({
        message: 'Buscando...'
      });
      await loading.present();

      this.dragonBallService.filterCharacters({ name: this.searchTerm }).subscribe(
        (characters) => {
          this.characters = characters.map(char => ({
            ...char,
            showFullDescription: false
          }));
          loading.dismiss();
        },
        (error) => {
          console.error('Error:', error);
          loading.dismiss();
        }
      );
    } else {
      this.currentPage = 1;
      this.loadCharacters();
    }
  }
}
