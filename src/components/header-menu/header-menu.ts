import { Component, Input } from '@angular/core';

/**
 * Generated class for the HeaderMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-header-menu',
  templateUrl: 'header-menu.html'
})
export class HeaderMenuComponent {

  @Input()
  pageName: any;


  constructor() {
    //console.log('Hello HeaderMenuComponent Component');
  }

}
