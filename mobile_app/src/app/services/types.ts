export interface Construction {
  cities: City[];
}

export interface City {
  city: string;
  sites: Site[];
}

export interface Site {
  siteName: string;
  planets: Planet[];
}

export interface Planet {
  planetName: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  constructions: Construction[];
}

export interface Construction {
  lat: string;
  lon: string;
  shortestDist: string;
}
