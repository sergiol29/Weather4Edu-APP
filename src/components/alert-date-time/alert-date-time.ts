import { Component } from '@angular/core';

/* Alert */
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the AlertDateTimeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'alert-date-time',
  templateUrl: 'alert-date-time.html'
})
export class AlertDateTimeComponent {

  text: string;

  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertDateTimeComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit() {
    
  }

}
