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

  /* Variable form */
  form: FormGroup;
  selectVariables = [];
  selectRange = ['7', '15', '30'];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController, private apiProv: ApiProvider, private fb: FormBuilder) {
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad StationDetailsPage');
    this.idStation = this.navParams.get('id');
    //this.idStation = 1;

    let from = moment().subtract(7, 'days').unix();
    this.getDataAPI(from);
  }

  getDataAPI(from:number) {
    /* Now timestamp */
    let to = moment().unix();

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
          this.generateDataGraph(this.form.get('variables').value);
          this.generateDataTable(this.form.get('variables').value);

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
      aux.push(data.name);
    }

    this.selectVariables = aux;
  }

  /* Read data for Graph */
  generateDataGraph(variable:any) {    
    for( let data of this.station['data'] ) {
      if( data.name === variable ) {
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
  generateDataTable(variable:any) {    
    for( let data of this.station['data'] ) {
      if( data.name === variable ) {
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

  /* Control Change Select */
  onChangeVariable(variable:any) {
    this.generateDataGraph(variable);
    this.generateDataTable(variable);
  }

  /* Control Change Select */
  onChangeRange(range:any) {
    let from = moment().subtract(range, 'days').unix();
    this.getDataAPI(from);
  }
}
