import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/* Import for form */ 
import {Validators, FormBuilder, FormGroup } from '@angular/forms';  
  
/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  form: FormGroup;
  email: any;
  password: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private fb: FormBuilder, private apiProv: ApiProvider, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
    this.createForm();
  }

  /* Created form */
  createForm() {
    /* If form is created, dont created again */
    if (this.form) return;
      
    /* Create form */
    this.form = this.fb.group({                                     
      email: [this.email, [Validators.required, Validators.pattern('^[A-Z0-9a-z\\._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$')]],
      password: [this.password, [Validators.required, Validators.minLength(6)]],
    });
  }

  /* Accept modal page */
  onSubmit(){
    let data = this.form.value;
    
    /* Get data in API */
    this.apiProv.getUserLogin(data.email, data.password).subscribe(
      data => {
        this.user = data;
        this.navCtrl.push('HomePage', { id: this.user.id });
      }, 
      error => { 
        /* If user not exist show alert error */
        let alert = this.toastCtrl.create({
          message: 'Error, email or password incorrect',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'OK'
        });
        alert.present(); 
      }    
    );
  }

}