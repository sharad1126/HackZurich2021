/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConcreteService } from 'src/app/services/concrete.service';
import { ConnectivityService } from 'src/app/services/connectivity.service';
import { MapService } from './../../services/map.service';
import { environment } from './../../../environments/environment';
import { Construction } from 'src/app/services/types';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;

  map: any; //google.maps.Map;
  service: any; //: google.maps.places.PlacesService;
  infowindow: any; //google.maps.InfoWindow;
  markers: any;
  mapInitialised: boolean = false;
  public UI: 'C' | 'S' = null;
  public data: Construction;
  public plants: any = null;
  public sites: any = null;
  public places = 0;
  public weather = null;
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

  /** */
  constructor(
    private connSrvc: ConnectivityService,
    private concrtSrvc: ConcreteService,
    private httpClient: HttpClient,
    private mapSrvc: MapService
    ) {
      this.mapSrvc.places$.subscribe(p => {
        this.places = p;
      });
    }

  ngOnInit() {
    this.httpClient.get<Construction>('../assets/data.json').subscribe(d => {
      this.data = d;
      console.log('data', d);
    });
  }

  setUI(view) { this.UI = view; }

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

    this.loadGoogleMaps();
  }

  /**
   * on selected city
   * get city weather
   * get plants & plot them in RED
   */
  onCity(e) {
    console.log('plants', e.detail.value.plants);
    this.plants = e.detail.value.plants;
    this.sites = e.detail.value.sites;
    console.log('sites', this.sites);
    this.concrtSrvc.getWeatherByCity(e.detail.value.city).subscribe(w => {
      console.log('weather', w);
      this.weather = w;
    });

    if (this.plants.length > 0) { this.loadGoogleMaps(); }
  }

  onSite(e) {
    console.log('sites', e.detail.value);
    for (let i = 0; i < e.detail.value.constructions.length; i++) {
      let latLng = new google.maps.LatLng(e.detail.value.constructions[i].lat, e.detail.value.constructions[i].lon);
      new google.maps.Marker({
        position: latLng,
        map: this.map,
        icon: { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'}
      });
    }
  }

/**
 */
  loadGoogleMaps() {
    this.places = 0;
    //this.addConnectivityListeners();
    if (typeof google == 'undefined' || typeof google.maps == 'undefined' || typeof google.maps.places == 'undefined'){
      console.log('Google maps JavaScript needs to be loaded.');
      this.disableMap();
      if(this.connSrvc.isOnline()){
        console.log('online, loading map');
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        };
        let script = document.createElement('script');
        script.id = 'googleMaps';
        if(environment.apiKey){
          script.src = 'https://maps.google.com/maps/api/js?key=' + environment.apiKey + '&callback=mapInit&libraries=places';
        } else {
          script.src = 'https://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      }
    }
    else {
      if (this.connSrvc.isOnline()) {
        console.log('showing map');
        this.initMap();
        this.enableMap();
      }
      else {
        console.log('disabling map');
        this.disableMap();
      }
    }
  }

  /**
   * on C, plot the construction & search near by POI
   * on S, plot plants of selected city
   */
  initMap() {
    this.mapInitialised = true;
    let latLng = this.UI === 'C' ?
      new google.maps.LatLng(this.project.lat, this.project.lon) :
      new google.maps.LatLng(this.plants[0].lat, this.plants[0].lon);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    if (this.UI === 'C') {
      new google.maps.Marker({ position: latLng, map: this.map });
      const marker = new google.maps.Marker({
        position: latLng, map: this.map,
        icon: { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'}
      });
      this.searchByPlace(latLng);
    } else {
      for (let i = 0; i < this.plants.length; i++) {
        latLng = new google.maps.LatLng(this.plants[i].lat, this.plants[i].lon);
        new google.maps.Marker({ position: latLng, map: this.map});
      }
    }


  }

  disableMap() { console.log('disable map'); }
  enableMap() { console.log('enable map'); }

  searchByPlace(latLng) {
    let service = new google.maps.places.PlacesService(this.map);
    console.log(service);

    service.nearbySearch({
      location: latLng,
      radius: 50,
      types: ['']
    }, (results, status) => {
      this.callback(results, status);
    });
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.places = results.length;
      console.log('places', results);
      for (let i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  }

  createMarker(place: any) {
    if (!place.geometry || !place.geometry.location) {return;}

    const marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });

    // new google.maps.event.addListener(marker, 'click', () => {
    //   this.infowindow.setContent(place.name || '');
    //   this.infowindow.open(this.map);
    // });
  }

}
