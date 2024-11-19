import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Character, Planet } from '../app/interfaces/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DragonBallService {
  private apiUrl = 'https://dragonball-api.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1, limit: number = 10): Observable<ApiResponse<Character>> {
    return this.http.get<ApiResponse<Character>>(`${this.apiUrl}/characters?page=${page}&limit=${limit}`);
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/characters/${id}`);
  }

  filterCharacters(filters: {
    name?: string;
    gender?: 'Male' | 'Female' | 'Unknown';
    race?: string;
    affiliation?: string;
  }): Observable<Character[]> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return this.http.get<Character[]>(`${this.apiUrl}/characters?${queryParams}`);
  }

  getPlanets(page: number = 1, limit: number = 10): Observable<ApiResponse<Planet>> {
    return this.http.get<ApiResponse<Planet>>(`${this.apiUrl}/planets?page=${page}&limit=${limit}`);
  }

  getPlanetById(id: number): Observable<Planet> {
    return this.http.get<Planet>(`${this.apiUrl}/planets/${id}`);
  }
}