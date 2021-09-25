/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConcreteService } from 'src/app/services/concrete.service';
import { MapService } from './../../services/map.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public tab = '';

  @ViewChild('map') mapElement: ElementRef;

  // map: any; //google.maps.Map;
  // service: any; //: google.maps.places.PlacesService;
  // infowindow: any; //google.maps.InfoWindow;
  // markers: any;
  // mapInitialised: boolean = false;
  public places = 0;
  public project: any = null;
  public projects = [
    {
      city: 'Toronto', name: 'Project 1', lat: '43.664636', lon: '-79.41174',
      orderId: 'e2fc47a4-0dfa-472c-9b4b-86fa8389dc1f', payloadId: 'aecf1212-d8bc-44bf-9d66-596e23ff3927'
    },
    {
      city: 'Toronto', name: 'Project 2', lat: '43.654973', lon: '-79.37634',
      orderId: 'df2e6973-fe83-44b3-8d72-82941f9f41f5', payloadId: '98fad1f7-2f5f-4a38-9cf7-e0bd305fc990'
    }
  ];


  /** set tabs */
  constructor(
    private concrtSrvc: ConcreteService,
    private mapSrvc: MapService
    ) {
      this.tab = this.concrtSrvc.tabs[0];
      this.mapSrvc.places$.subscribe(p => {
        this.places = p;
      });
    }

  /**
   * set project coordinate
   * view map of the project
   */
  onProject(e) {
    console.log('selected project', e.detail.value);
    this.project = e.detail.value;
    this.concrtSrvc.getWeather(this.project.lat, this.project.lon).subscribe(w => {
      console.log('weather', w);
      this.project.weather = w;
    });
    this.mapSrvc.loadGoogleMaps(this.mapElement, this.project.lat, this.project.lon);
  }
}
