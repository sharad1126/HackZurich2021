import { ConcreteService } from './../../services/concrete.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public tabs = ['',''];

  /**
   * set tabs
   */
  constructor(private concrtSrvc: ConcreteService) {
    this.tabs = this.concrtSrvc.tabs;

  }

}
