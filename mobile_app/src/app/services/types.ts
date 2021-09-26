export interface Construction {
  cities: City[];
}

export interface City {
  city: string;
  plants: Plants[];
}

export interface Plants {
  name: string;
  lat: string;
  lon: string;
  id: string;
  sites: Site[];
}

export interface Site {
  siteName: string;
  constructions: Construction[];
}

export interface Construction {
  lat: string;
  lon: string;
  shortestDist: string;
}
