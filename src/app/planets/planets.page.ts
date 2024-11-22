import { Component, OnInit } from '@angular/core';
import { DragonBallService } from '../../services/dragonball.service';
import { LoadingController } from '@ionic/angular';
import { Planet } from '../interfaces/api.interfaces';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.page.html',
  styleUrls: ['./planets.page.scss'],
})
export class PlanetsPage implements OnInit {
  planets: Planet[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  searchTerm: string = '';
  private allPlanets: Planet[] = [];

  constructor(
    private dragonBallService: DragonBallService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadPlanets();
  }

  async loadPlanets(event?: any) {
    if (!this.isLoading) {
      this.isLoading = true;
      
      const loading = await this.loadingCtrl.create({
        message: 'Cargando planetas...'
      });
      await loading.present();

      this.dragonBallService.getPlanets(this.currentPage).subscribe(
        (response) => {
          if (event) {
            this.planets = [...this.planets, ...response.items];
            this.allPlanets = [...this.allPlanets, ...response.items];
          } else {
            this.planets = response.items;
            this.allPlanets = response.items;
          }
          this.totalPages = response.meta.totalPages;
          this.isLoading = false;
          loading.dismiss();
          if (event) {
            event.target.complete();
          }
          if (event && this.currentPage >= this.totalPages) {
            event.target.disabled = true;
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

  searchPlanets() {
    if (!this.searchTerm.trim()) {
      this.planets = [...this.allPlanets];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.planets = this.allPlanets.filter(planet => 
      planet.name.toLowerCase().includes(searchTermLower) ||
      planet.description.toLowerCase().includes(searchTermLower)
    );
  }

  loadMore(event: any) {
    this.currentPage++;
    this.loadPlanets(event);
  }
}
