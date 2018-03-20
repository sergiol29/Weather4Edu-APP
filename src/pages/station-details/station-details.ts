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
  
  /* Value for Taps Segment */
  segment: string = "graph";

  /* Variables Graph and Table */
  dataGraph = [];
  dataTable = [];
  nameGraph: string;
  symbolGraph: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController, private apiProv: ApiProvider) {
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad StationDetailsPage');
    //this.idStation = this.navParams.get('id');
    this.idStation = 1;

    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
      /* Get data in API */
      this.apiProv.getShowStation(this.idStation).subscribe(
        (data) => {
          this.station = data;
          this.generateDataGraph();
          this.generateDataTable();

          /* Hide loading spinner */
          loader.dismiss();
        });

    });
  }

  /* Read data for Graph */
  generateDataGraph() {    
    for( let data of this.station['data'] ) {
      if( data.name === "Batería" ) {
        this.nameGraph = data.name;
        this.symbolGraph = data.symbol;
        let aux = [];
        for( let values of data.values ) {
          aux.push( [values.timestamp * 1000, +values.value] );
        }
        this.dataGraph = aux;
      }
    }
  }

  /* Read data for Table */
  generateDataTable() {    
    for( let data of this.station['data'] ) {
      let aux = [];
      for( let values of data.values ) {
        /* Convert Timestamp to Date */
        let date = moment.unix(values.timestamp).format("MM-DD-YYYY - HH:mm:ss");
        aux.push( [date, values.value] );
      }
      this.dataTable = aux;
    }
  }
}
