import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* Loading Spinner */
import { LoadingController } from 'ionic-angular';

/* Import Lib MomentJS */
import * as moment from 'moment';

/* Import for form */
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

/* Modal */
import { ModalController } from 'ionic-angular';

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
  rangeGraph: string;
  symbolGraph = [];

  /* Variable form */
  form: FormGroup;
  selectVariables = [];
  selectRange = ['7', '15', '30'];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController, private apiProv: ApiProvider, private fb: FormBuilder,
    private modalCtrl: ModalController) {
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad StationDetailsPage');
    //this.idStation = this.navParams.get('id');
    this.idStation = 1;

    let from = moment().subtract(7, 'days').unix();
    this.getDataAPI(from);
  }

  /* Variable to is opcional */
  getDataAPI(from:number, to?:number) {
    /* Now timestamp */
    if( !to ) {
      to = moment().unix();
    }

    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
      /* Get data in API */
      this.apiProv.getShowStation(this.idStation, from, to).subscribe(
        (data) => {
          this.station = data;

          /* Generate data */
          this.generateSelectVariable();

          this.createForm();
          
          /* Generate data */
          //this.generateDataGraph(this.form.get('variables').value);
          //this.generateDataTable(this.form.get('variables').value);

          /* Hide loading spinner */
          loader.dismiss();
        });
    });
  }

  /* Created form */
  createForm() {
    /* If form is created, dont created again */
    if (this.form) return;

    /* Create form */
    this.form = this.fb.group({
      variables: [this.selectVariables[0], Validators.required],
      range: [this.selectRange[0], Validators.required],
    });
  }

  /* Complete values in select variables */
  generateSelectVariable() {
    let aux = [];
    for( let data of this.station['data'] ) {
      aux.push({ 'name': data.name, 'type': data.type, 'symbol': data.symbol });
    }

    this.selectVariables = aux;
  }

  /* Read data for Graph */
  generateDataGraph(variables:any) {    
    this.dataGraph = [];
    this.rangeGraph = this.form.get('range').value;

    for( let data of this.station['data'] ) {
      /* Check if data.name exist in variables */
      if( variables.indexOf(data.name) !== -1 ) {
        this.symbolGraph.push(data.symbol);
        let aux = [];    
        for( let values of data.values ) {
          aux.push( [values.timestamp * 1000, +values.value] );
        }
        this.dataGraph.push( {name: data.name, data: aux} );
      }
    }
  }

  /* Read data for Table */
  generateDataTable(variables:any) {    
    this.dataTable = [];
    for( let data of this.station['data'] ) {
      /* Check if data.name exist in variables */
      if( variables.indexOf(data.name) !== -1 ) {
        let aux = [];
        for( let values of data.values ) {
          /* Convert Timestamp to Date */
          let date = moment.unix(values.timestamp).format("MM-DD-YYYY - HH:mm:ss");
          aux.push( [date, values.value] );
        }
        this.dataTable.push( {name: data.name, symbol: data.symbol, data: aux} );
      }
    }
  }

  /* Control Change Select */
  onChangeVariable(variables:any) {
    this.generateDataGraph(variables);
    this.generateDataTable(variables);
  }

  /* Control Change Select */
  onChangeRange(range:any) {
    let from = moment().subtract(range, 'days').unix();

    if( range != 'custom' ) {
      this.getDataAPI(from);
    } else {
      this.openModalCustomDate();
    }
  }

  openModalCustomDate(){
    /* Open Modal Page */
    let modal = this.modalCtrl.create('ModalPage',{},{showBackdrop:true, enableBackdropDismiss:true});

    /* When close modal refresh data */
    modal.onDidDismiss(data => {
      /* If data is !null, get data in API */
      if( data ) {
        this.getDataAPI( moment(data.from).unix(), moment(data.to).unix() );
      }
    });

    modal.present();
  }
}
