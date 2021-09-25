import { Component } from '@angular/core';
import { ConcreteService } from 'src/app/services/concrete.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public tab = '';

  /**
   * set tabs
   */
  constructor(private concrtSrvc: ConcreteService) {
    this.tab = this.concrtSrvc.tabs[1];
  }

}
