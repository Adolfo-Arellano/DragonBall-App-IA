import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../app/interfaces/api.interfaces';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiUrl = `${environment.apiUrl}/api/generate-story`;

  constructor(private http: HttpClient) {}

  generateStory(characters: Character[], targetAge: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const prompt = this.buildPrompt(characters, targetAge);

    return this.http.post(this.apiUrl, {
      prompt: prompt,
      max_tokens: 1000
    }, { headers });
  }

  private buildPrompt(characters: Character[], targetAge: number): string {
    const characterInfo = characters.map(char => 
      `Nombre: ${char.name}
       Raza: ${char.race}
       Descripción: ${char.description}
       PlanetaDeOrigen: ${char.originPlanet}
       Transformaciones: ${char.transformations}`
    ).join('\n\n');

    return `Crea un cuento infantil mágico y detallado para niños de ${targetAge} años usando los siguientes personajes de Dragon Ball:
    
    ${characterInfo}
    
    Requisitos para el cuento:
    - Extensión: Mínimo 800 palabras
    - Estructura: 
    * Introducción que presente el escenario y los personajes
    * Desarrollo con un conflicto o desafío claro
    * Clímax emocionante 
    * Resolución satisfactoria
    - Incluir:
    * Diálogos entre personajes
    * Descripciones vívidas del entorno
    * Al menos 2 momentos de tensión/emoción
    * Una lección o moraleja sutilmente integrada
    - Valores a transmitir: amistad, trabajo en equipo, perseverancia
    - Tono optimista y aventurero
    - Lenguaje apropiado para ${targetAge} años
    - Evitar violencia explícita o temas complejos
    El cuento debe mantener elementos del universo Dragon Ball pero adaptados para niños pequeños.`;
  }
}
