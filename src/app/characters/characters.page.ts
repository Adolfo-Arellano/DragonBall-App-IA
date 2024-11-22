import { Component, OnInit } from '@angular/core';
import { DragonBallService } from '../../services/dragonball.service';
import { LoadingController } from '@ionic/angular';
import { Character } from '../interfaces/api.interfaces';

interface CharacterWithUI extends Character {
  showFullDescription: boolean;
  showTransformations: boolean;
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
  swiperModules = ['navigation', 'pagination'];

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
        async (response) => {
          try {
            const newCharacters = await Promise.all(
              response.items.map(async (char) => {
                const characterWithTransformations = await this.dragonBallService
                  .getCharacterById(char.id)
                  .toPromise();
                
                if (!characterWithTransformations) {
                  throw new Error(`No se pudo cargar el personaje con ID ${char.id}`);
                }

                return {
                  ...characterWithTransformations,
                  showFullDescription: false,
                  showTransformations: false,
                  id: characterWithTransformations.id,
                  name: characterWithTransformations.name || 'Sin nombre',
                  ki: characterWithTransformations.ki || '0',
                  maxKi: characterWithTransformations.maxKi || '0',
                  race: characterWithTransformations.race || 'Desconocido',
                  gender: characterWithTransformations.gender || 'Desconocido',
                  description: characterWithTransformations.description || 'Sin descripción',
                  image: characterWithTransformations.image || 'assets/default-character.png',
                  affiliation: characterWithTransformations.affiliation || 'Desconocido',
                  transformations: characterWithTransformations.transformations || []
                } as CharacterWithUI;
              })
            );
            
            if (event) {
              this.characters = [...this.characters, ...newCharacters];
            } else {
              this.characters = newCharacters;
            }
            
            this.totalPages = response.meta.totalPages;
          } catch (error) {
            console.error('Error al cargar personajes:', error);
          }
          
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
            showFullDescription: false,
            showTransformations: false,
            id: char.id,
            name: char.name || 'Sin nombre',
            ki: char.ki || '0',
            maxKi: char.maxKi || '0',
            race: char.race || 'Desconocido',
            gender: char.gender || 'Desconocido',
            description: char.description || 'Sin descripción',
            image: char.image || 'assets/default-character.png',
            affiliation: char.affiliation || 'Desconocido',
            transformations: char.transformations || []
          } as CharacterWithUI));
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
