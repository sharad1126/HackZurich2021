/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConnectivityService } from './connectivity.service';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: any;
  service: any;
  infowindow: any;
  markers: any;
  mapInitialised: boolean = false;

  public places$ = new BehaviorSubject<number>(0);
  private apiKey = 'AIzaSyCWrb13ubL2t1RjJ4nFncpXTGct_MudNjc';
  private apiKeyMapBox = 'pk.eyJ1Ijoia2FtcmlraSIsImEiOiJja3UwMWNpZGEyMTdvMnJxdGtteGtzdDR6In0.6gcJIz5zwJLLAQD0VmfU0A';

  constructor(
    private connSrvc: ConnectivityService,
  ) { }

  /**
   * reset places$
   */
  loadGoogleMaps(mapElement: ElementRef, lat, lon) {
    this.places$.next(0);
    //this.addConnectivityListeners();
    if (typeof google == 'undefined' || typeof google.maps == 'undefined' || typeof google.maps.places == 'undefined'){
      console.log('Google maps JavaScript needs to be loaded.');
      this.disableMap();
      if(this.connSrvc.isOnline()){
        console.log('online, loading map');
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap(mapElement, lat, lon);
          this.enableMap();
        };
        let script = document.createElement('script');
        script.id = 'googleMaps';
        if(this.apiKey){
          script.src = 'https://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
        } else {
          script.src = 'https://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      }
    }
    else {
      if (this.connSrvc.isOnline()) {
        console.log('showing map');
        this.initMap(mapElement, lat, lon);
        this.enableMap();
      }
      else {
        console.log('disabling map');
        this.disableMap();
      }
    }
  }

  initMap(mapElement: ElementRef, lat, lon) {
    this.mapInitialised = true;
    let latLng = new google.maps.LatLng(lat, lon);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    new google.maps.Marker({ position: latLng, map: this.map });
    const marker = new google.maps.Marker({
      position: latLng, map: this.map,
      icon: { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'}
    });

    this.searchByPlace(latLng);
  }

  searchByPlace(latLng) {
    let service = new google.maps.places.PlacesService(this.map);
    console.log(service);

    service.nearbySearch({
      location: latLng,
      radius: 500,
      types: ['restaurant']
    }, (results, status) => {
      this.callback(results, status);
    });
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.places$.next(results.length);
      console.log('places', results);
      for (let i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  }

  searchByQuery() {
    const request = {
      query: 'Museum',
      fields: ['name', 'geometry'],
    };

    this.service.findPlaceFromQuery(
      request,
      (
        // results: google.maps.places.PlaceResult[] | null,
        // status: google.maps.places.PlacesServiceStatus
        results: any, status: any
        ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          console.log('places', results);
          for (let i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
          }

         //this.map.setCenter(results[0].geometry!.location!);
        }
      }
    );
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

  disableMap() { console.log('disable map'); }
  enableMap() { console.log('enable map'); }

  // addConnectivityListeners(){
  //   let onOnline = () => {
  //     setTimeout(() => {
  //       if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
  //         this.loadGoogleMaps();
  //       } else {
  //         if (!this.mapInitialised) { this.initMap();
  //         }
  //         this.enableMap();
  //       }
  //     }, 2000);
  //   };
  //   let onOffline = () => {
  //     this.disableMap();
  //   };

  //   document.addEventListener('online', onOnline, false);
  //   document.addEventListener('offline', onOffline, false);
  // }
}
