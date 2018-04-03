import { Component, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/* Import for form */ 
import {Validators, FormBuilder, FormGroup } from '@angular/forms';  
  
/* Load Provider */
import { ApiProvider } from '../../providers/api/api';
 
/**
 * Generated class for the ModalUpdateDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@IonicPage()
@Component({ 
  selector: 'page-modal-update-device',
  templateUrl: 'modal-update-device.html',
})
export class ModalUpdateDevicePage {

  form: FormGroup;
  nameDevice: any;
  idDevice: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private viewCtrl: ViewController, private renderer: Renderer, private fb: FormBuilder,
              private apiProv: ApiProvider) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'custom-modal-update', true);
  }

  ionViewDidLoad() { 
    //console.log('ionViewDidLoad ModalUpdateDevicePage');
    this.nameDevice = this.navParams.get('name');
    this.idDevice = this.navParams.get('id');  
    this.createForm();
  }

  /* Created form */
  createForm() {
    /* If form is created, dont created again */
    if (this.form) return;
      
    /* Create form */
    this.form = this.fb.group({
      name: [this.nameDevice, [Validators.required, Validators.maxLength(128), Validators.minLength(5)]],
    });
  }

  /* Cancel modal page */
  cancelModal(){
    this.viewCtrl.dismiss();
  }

  /* Accept modal page */
  onSubmit(){
    let data = this.form.value;
    /* Get data in API */
    this.apiProv.putUpdateStation(this.idDevice, data).subscribe(
      (data) => {
        
       }
    );
    this.viewCtrl.dismiss();
  }

}
