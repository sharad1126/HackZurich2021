import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConcreteService {
  public tabs = ['Construction','Suppliers'];
  private apiKeyWeather = '6f306268e9d6d3c2c05178fd5e8b67d0';

  constructor(
    private http: HttpClient
  ) { }

  /** get weather by coordinate */
  getWeather(lat, lon): Observable<any> {
    console.log('weather', lat, lon);
    return this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKeyWeather}`
      );
  }
  getWeatherByCity(city): Observable<any> {
    console.log('weather by city', city);
    return this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKeyWeather}`
      );
  }
}
