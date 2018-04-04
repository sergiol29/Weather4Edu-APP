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

/* Import Geolocation for Google Maps */
declare var google;

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
  nameAddress: any;

  /* Value for Taps Segment */
  segment: string = "graph";

  /* Variables Graph and Table */
  dataGraph = [];
  dataTable = [];
  rangeGraph: string;
  symbolGraph = [];  
  typeGraph: any; 
   
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
    this.idStation = this.navParams.get('id');
    //this.idStation = 1;

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

          /* Get Adress of station */
          if( this.station.type_device === 'gps' ) {
            /* Get last latitude and longitude */
            let last = this.station.data[0].values.length - 1;
            this.getStreetGoogleMaps(this.station.data[0].values[last].value, this.station.data[1].values[last].value);
          } else {
            this.getStreetGoogleMaps(this.station.latitude, this.station.longitude);
          }
          
          /* Generate data */
          if(this.selectVariables.length === 0) { this.generateSelectVariable(); }

          this.createForm();
          
          /* Generate data */
          this.typeGraph = this.getTypeVariablesForm();
          if( this.typeGraph === "float" ) {
            this.generateDataGraphLines( this.getVariablesForm() );
          } else {
            this.generateDataGraphBar( this.getVariablesForm() );
          }

          this.generateDataTable( this.getVariablesForm() );

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
    let valuesDontShow = ['Latitud', 'Longitud'];
    let aux = [];
    for( let data of this.station['data'] ) {

      /* Check if value inside in array  */
      if( valuesDontShow.indexOf(data.name) === -1 ) { 
        aux.push({ 'name': data.name, 'type': data.type, 'symbol': data.symbol });
      }
    
    }

    this.selectVariables = aux;
  }

  /* Get Range select in form for Graph */
  getRangeForm() {
    this.rangeGraph = this.form.get('range').value;
  }

  /* Get Variables select in form for Graph */
  getVariablesForm() {
    let auxVariables = [];
    if( !Array.isArray( this.form.get('variables').value ) ) {
      auxVariables.push( this.form.get('variables').value.name );
    } else {
      this.form.get('variables').value.forEach(element => { auxVariables.push(element.name) });
    }

    return auxVariables;
  }

  getTypeVariablesForm() {
    if( !Array.isArray( this.form.get('variables').value ) ) {
      return this.form.get('variables').value.type;
    } else {
      return this.form.get('variables').value[0].type;
    }
  }

  /* Read data for Graph */
  generateDataGraphLines(variables:any) {    
    this.dataGraph = [];
    this.getRangeForm();

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

  /* Read data for Graph */
  generateDataGraphBar(variables:any) {    
    this.dataGraph = [];
    this.getRangeForm();
    
    for( let data of this.station['data'] ) {
      /* Check if data.name exist in variables */
      if( variables.indexOf(data.name) !== -1 ) {
        this.symbolGraph.push(data.symbol);
        let _contStop = 0;
        let _contMove = 0;
        
        for( let values of data.values ) {
          if( values.value === "PARADO" ) {
            _contStop++;
          } else {
            _contMove++;
          }
        }
        this.dataGraph.push( {name: "STOP", data: [_contStop]} );
        this.dataGraph.push( {name: "MOVEMENT", data: [_contMove]} );
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
          let date = moment.unix(values.timestamp).format("DD-MM-YYYY - HH:mm");
          aux.push( [date, values.value] );
        }
        this.dataTable.push( {name: data.name, symbol: data.symbol, data: aux} );
      }
    }
  }

  /* Control Change Select */
  onChangeVariable(variables:any) {
    let auxVariables = [];
    let auxTypes = [];
    variables.forEach(element => { auxVariables.push(element.name) });
    variables.forEach(element => { auxTypes.push(element.type) });
    if( auxTypes.indexOf("string") !== -1 && auxTypes.indexOf("float") !== -1 ) {
      this.typeGraph = "errorGraph";
    } else if( auxTypes.indexOf("float") !== -1 ) {
      this.typeGraph = "float";
      this.generateDataGraphLines(auxVariables);
    } else {
      this.typeGraph = "string";
      this.generateDataGraphBar(auxVariables);
    }

    /* Data for table */
    this.generateDataTable(auxVariables);
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

  /* Get street with Lat and Lng */
  getStreetGoogleMaps(latitude: number, longitude: number) {
    let latLngDevice = { lat: +latitude, lng: +longitude };

    /* Inverse Geocoder for get street with latitude and longitude */
    var geocoder = new google.maps.Geocoder;

    geocoder.geocode({'location': latLngDevice}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          this.nameAddress = results[0].formatted_address;
        } 
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }
}
