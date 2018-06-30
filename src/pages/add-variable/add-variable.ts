import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';

/* Import for form */ 
import {Validators, FormBuilder, FormGroup } from '@angular/forms';  

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* LocalStorage */
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
/**
 * Generated class for the AddVariablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-variable',
  templateUrl: 'add-variable.html',
})
export class AddVariablePage {

  form: FormGroup;
  idUser: number;
  nameVariable: any;
  symbolVariable: any;
  codeVariable: any;
  colorVariable: any;

  variables: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private fb: FormBuilder, private apiProv: ApiProvider, private toastCtrl: ToastController,
              private loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private modalCtrl: ModalController, private storage: LocalstorageProvider) {
  }

  ngOnInit() {
    this.idUser = this.navParams.get('user_id');
    //this.idUser = 1;
    this.getDataAPI();
    this.createForm();
  }

  getDataAPI() { 
    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {  
      /* Get subscription */
      this.apiProv.getVariablesUser(this.idUser).subscribe( 
        (data) => {
          this.variables = data; 
          
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
      user_id: [this.idUser, [Validators.required]],
      code: [this.codeVariable, [Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
      name: [this.nameVariable, [Validators.required, Validators.maxLength(24), Validators.minLength(4)]],
      symbol: [this.symbolVariable, [Validators.maxLength(4)]],
      color: [this.colorVariable, [Validators.maxLength(7), Validators.minLength(7)]]
    });
  }

  /* Accept modal page */
  onSubmit() {
    let data = this.form.value;
    
    /* Get data in API */
    this.apiProv.addVariable(data).subscribe(
      data => {
        /* Call getDataAPI */
        this.getDataAPI();
        this.resetForm();
      },
      error => { 
        /* If exist error show alert error */
        let alert = this.toastCtrl.create({
          message: 'Error, Code or Name has already been taken',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'OK'
        });

        alert.present(); 
      }
    );
  }

  /* Reset Input Form */
  resetForm() {
    this.form.get('code').reset();
    this.form.get('name').reset();
    this.form.get('symbol').reset();
    this.form.get('color').reset();
  }

  updateVariable(id: number) {
    /* Open Modal Page */
    let modal = this.modalCtrl.create('ModalUpdateVariablePage',{id: id},{showBackdrop:true, enableBackdropDismiss:true});
    
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
    this.apiProv.destroyVariablesUser(id_variable).subscribe(
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

  getMoreDetails(id: number) {
    this.navCtrl.push('StationDetailsPage', { id: id });
  }
  
  goToHome(id_user: number) {
    this.navCtrl.push('HomePage', { id: id_user });
  }

  logout() {
    this.storage.clearStorage();
    this.navCtrl.push('LoginPage');
  }

}
