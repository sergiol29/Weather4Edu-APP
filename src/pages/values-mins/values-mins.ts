import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';

/* Load Provider */                     
import { ApiProvider } from '../../providers/api/api';   

/* LocalStorage */
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

/* Import Lib MomentJS */  
import * as moment from 'moment'; 

/**
 * Generated class for the ValuesMinsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-values-mins',
  templateUrl: 'values-mins.html',
})
export class ValuesMinsPage {

  idStation: number;
  station: any;

  constructor(private apiProv: ApiProvider, public navCtrl: NavController, public navParams: NavParams,
              private loadingCtrl: LoadingController, private modalCtrl: ModalController, private storage: LocalstorageProvider ) {
  }

  ngOnInit() {
    this.idStation = this.navParams.get('id');
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
      this.apiProv.getValuesMins(this.idStation).subscribe( 
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
    return moment.unix(timestamp).format("dddd, D MMMM YYYY - H:mm");
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

  getMoreDetails(id_station: number) {
    this.navCtrl.push('StationDetailsPage', { id: id_station });
  }

  getValuesMaxes(id_station: number) {
    this.navCtrl.push('ValuesMaxesPage', { id: id_station });
  }
  
  goToHome(id_user: number) {
    this.navCtrl.push('HomePage', { id: id_user });
  } 

  logout() {
    this.storage.clearStorage();
    this.navCtrl.push('LoginPage');
  }

  doRefresh(refresher) {
    this.getDataAPI();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
