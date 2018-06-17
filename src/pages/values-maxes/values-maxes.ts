import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';

/* Load Provider */                     
import { ApiProvider } from '../../providers/api/api';   

/* Import Lib MomentJS */  
import * as moment from 'moment'; 

/**
 * Generated class for the ValuesMaxesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-values-maxes',
  templateUrl: 'values-maxes.html',
})
export class ValuesMaxesPage {

  idStation: number;
  station: any;

  constructor(private apiProv: ApiProvider, public navCtrl: NavController, public navParams: NavParams,
              private loadingCtrl: LoadingController, private modalCtrl: ModalController ) {
  }

  ngOnInit() {
    //this.idStation = this.navParams.get('id');
    this.idStation = 1;
    this.getDataAPI();
  }
  
  getDataAPI() { 
    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
       
      /* Get subscription */
      this.apiProv.getValuesMaxes(this.idStation).subscribe( 
        (data) => {
          this.station = data;

          /* Hide loading spinner */
          loader.dismiss();
      });

    });
  }

  getFilterLastedData(value: any) {
    let valuesDontShow = ['Batería'];
     
    /* value is include in array */
    if( valuesDontShow.indexOf(value) > -1 ) { 
      return false;
    } else {
      return true; 
    }
  }

  formatDate(timestamp: any) {
    return moment.unix(timestamp).format("dddd, MMMM D YYYY - H:mm");
  }
 
  getMoreDetails(id: number) {
    this.navCtrl.push('StationDetailsPage', { id: id });
  }

  getValuesMins(id: number) {
    this.navCtrl.push('ValuesMinsPage', { id: id });
  }

  openModalEditDevice(idStation: number, nameStation: any) {
    /* Open Modal Page */
    let modal = this.modalCtrl.create('ModalUpdateDevicePage',{id: idStation, name: nameStation},{showBackdrop:true, enableBackdropDismiss:true});
 
    /* When close modal refresh data */
    modal.onDidDismiss(data => { 
      this.getDataAPI();
    });
  
    modal.present();
  }

}
