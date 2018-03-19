import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* Loading Spinner */
import { LoadingController } from 'ionic-angular';

/* Import Lib MomentJS */
import * as moment from 'moment';

/**
 * Generated class for the StationDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-station-details',
  templateUrl: 'station-details.html',
})
export class StationDetailsPage {
  
  idStation: number;
  station: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController, private apiProv: ApiProvider) {
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad StationDetailsPage');
    this.idStation = this.navParams.get('id');
    console.log(this.idStation);

    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
      console.log(moment()); 
      /* Get data in API */
      this.apiProv.getShowStation(this.idStation).subscribe(
        (data) => {
          this.station = data;
          
          /* Hide loading spinner */
          loader.dismiss();
          console.log(data);
        });

    });
  }

}
