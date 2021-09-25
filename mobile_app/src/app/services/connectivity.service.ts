import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { Network } from 'ionic-native';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  onDevice: boolean;

  constructor(public platform: Platform){
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    // if(this.onDevice && Network.connection){
    //   return Network.connection !== Connection.NONE;
    // } else {
    //   return navigator.onLine;
    // }
    return navigator.onLine;
  }
  isOffline(): boolean {
    // if(this.onDevice && Network.connection){
    //   return Network.connection === Connection.NONE;
    // } else {
    //   return !navigator.onLine;
    // }
    return !navigator.onLine;
  }
}
