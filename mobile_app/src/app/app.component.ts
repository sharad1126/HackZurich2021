import { MapService } from './services/map.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private mapSrvc: MapService
  ) {
    //this.mapSrvc.loadGoogleMaps();
  }

}
