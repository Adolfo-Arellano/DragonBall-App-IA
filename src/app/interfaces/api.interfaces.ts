export interface ApiResponse<T> {
    items: T[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
    links: {
      first: string;
      previous: string;
      next: string;
      last: string;
    };
}
  
export interface Character {
    id: number;
    name: string;
    ki: string;
    maxKi: string;
    race: string;
    gender: string;
    description: string;
    image: string;
    affiliation: string;
    originPlanet?: Planet;
    transformations?: any[];
}
  
export interface Planet {
    id: number;
    name: string;
    isDestroyed: boolean;
    description: string;
    image: string;
    characters?: Character[];
}