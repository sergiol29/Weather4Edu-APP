import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/* Import for form */ 
import {Validators, FormBuilder, FormGroup } from '@angular/forms';  

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private fb: FormBuilder, private apiProv: ApiProvider, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.idUser = this.navParams.get('user_id');
    this.createForm();
  }

  /* Created form */
  createForm() {
    /* If form is created, dont created again */
    if (this.form) return;
      
    /* Create form */
    this.form = this.fb.group({
      user_id: [this.idUser, [Validators.required]],
      code: [this.codeVariable, [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
      name: [this.nameVariable, [Validators.required, Validators.maxLength(15), Validators.minLength(4)]],
      symbol: [this.symbolVariable, [Validators.maxLength(4)]]
    });
  }

  /* Accept modal page */
  onSubmit() {
    let data = this.form.value;
    
    /* Get data in API */
    this.apiProv.addVariable(data).subscribe(
      data => {
        /* Call getDATA */
        
      },
      error => { 
        /* If exist error show alert error */
        let alert = this.toastCtrl.create({
          message: 'Error, not created variable',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'OK'
        });

        alert.present(); 
      }
    );
  }

  goToHome(id_user: number) {
    this.navCtrl.push('HomePage', { id: id_user });
  }

  logout() {
    this.navCtrl.push('LoginPage');
  }

}
