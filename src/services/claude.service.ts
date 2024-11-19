import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../app/interfaces/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClaudeService {
  private apiUrl = 'http://localhost:3000/api/generate-story';

  constructor(private http: HttpClient) {}

  generateStory(characters: Character[], targetAge: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.apiUrl}`
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
       Descripción: ${char.description}`
    ).join('\n\n');

    return `Crea un cuento infantil para niños de ${targetAge} años usando los siguientes personajes de Dragon Ball:
    
    ${characterInfo}
    
    El cuento debe ser educativo, divertido y apropiado para la edad, incorporando valores positivos como la amistad, el trabajo en equipo y la superación personal. Usa un lenguaje sencillo y descriptivo, y asegúrate de que la historia tenga un inicio, desarrollo y final claro.`;
  }
}