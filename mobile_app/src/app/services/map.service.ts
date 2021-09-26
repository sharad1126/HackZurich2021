/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  loadGoogleMaps() {
    // this.places = 0;
    //this.addConnectivityListeners();
    if (typeof google == 'undefined' || typeof google.maps == 'undefined' || typeof google.maps.places == 'undefined'){
      console.log('Google maps JavaScript needs to be loaded.');
      this.disableMap();
      if(this.connSrvc.isOnline()){
        console.log('online, loading map');
        //Load the SDK
        window['mapInit'] = () => {
          // this.initMap();
          this.enableMap();
        };
        let script = document.createElement('script');
        script.id = 'googleMaps';
        if (environment.apiKey){
          script.src = 'https://maps.google.com/maps/api/js?key=' + environment.apiKey + '&callback=mapInit';
        } else {
          script.src = 'https://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      }
    }
    else {
      if (this.connSrvc.isOnline()) {
        console.log('showing map');
        // this.initMap();
        // this.enableMap();
      }
      else {
        console.log('disabling map');
        // this.disableMap();
      }
    }
  }

  disableMap() { console.log('disable map'); }
  enableMap() { console.log('enable map'); }

  // searchByQuery() {
  //   const request = {
  //     query: 'Museum',
  //     fields: ['name', 'geometry'],
  //   };

  //   this.service.findPlaceFromQuery(
  //     request,
  //     (
  //       // results: google.maps.places.PlaceResult[] | null,
  //       // status: google.maps.places.PlacesServiceStatus
  //       results: any, status: any
  //       ) => {
  //       if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //         console.log('places', results);
  //         for (let i = 0; i < results.length; i++) {
  //           this.createMarker(results[i]);
  //         }

  //        //this.map.setCenter(results[0].geometry!.location!);
  //       }
  //     }
  //   );
  // }

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
