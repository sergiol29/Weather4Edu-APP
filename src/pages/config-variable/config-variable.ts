import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* LocalStorage */
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

/**
 * Generated class for the ConfigVariablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config-variable',
  templateUrl: 'config-variable.html',
})
export class ConfigVariablePage {

  idStation: number;
  type_viewhuman: string = "operation";
  variables: any;
  idUser: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private apiProv: ApiProvider, private loadingCtrl: LoadingController, 
              private modalCtrl: ModalController, private storage: LocalstorageProvider, 
              private toastCtrl: ToastController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    //this.idStation = this.navParams.get('id');    
    this.idStation = 1;
    
    this.getDataAPI();

    /* Read ID_User of localstorage */
    this.storage.getUserID().then(value => {
      this.idUser = value;
    }) 
  }

  getDataAPI() { 
    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    }); 

    /* Show loading spinner */
    loader.present().then(() => {  
      /* Get subscription */
      this.apiProv.getVariablesStation(this.idStation).subscribe( 
        (data) => {
          this.variables = data; 
           
          /* Hide loading spinner */ 
          loader.dismiss();
      });
 
    });     
  }

  updateVariable(id_variable: number) {
    /* Open Modal Page */
    let modal = this.modalCtrl.create('ModalUpdateVariablePage',{ id: id_variable });
    
    /* When close modal refresh data */
    modal.onDidDismiss(data => { 
      this.getDataAPI();
    });
  
    modal.present();
  }

  showConfirmDelete(id_variable: number) {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete!',
          handler: () => {
            this.deleteVariable(id_variable);
          }
        }
      ]
    });
    alert.present();
  }

  deleteVariable(id_variable: number) {
    /* Get data in API */
    this.apiProv.destroyVariablesStation(id_variable).subscribe(
      data => {
        /* Call getDataAPI */
        this.getDataAPI();
      },
      error => { 
        /* If exist error show alert error */
        let alert = this.toastCtrl.create({
          message: 'Error, not destroy variable',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'OK'
        });

        alert.present(); 
      }
    );
  } 

  getAddVariables(id_station: number) {
    this.navCtrl.push('AddVariablePage', { id: id_station });
  }

  getMoreDetails(id_station: number) {
    this.navCtrl.push('StationDetailsPage', { id: id_station });
  }
  
  goToHome(id_user: number) {    
    this.navCtrl.push('HomePage', { id: id_user });
  }

  logout() {
    this.storage.clearStorage();
    this.navCtrl.push('LoginPage');
  }
}
