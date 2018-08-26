import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

/* Import for form */ 
import {Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';  

/* Load Provider */
import { ApiProvider } from '../../providers/api/api';

/* LocalStorage */
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

import { ElementRef } from '@angular/core';

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
  idStation: number;
  type_viewhuman;
  variables: any;
  idUser: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private fb: FormBuilder, private apiProv: ApiProvider, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private element:ElementRef, private storage: LocalstorageProvider,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.idStation = this.navParams.get('id');
    this.createForm();
    
    /* Read ID_User of localstorage */
    this.storage.getUserID().then(value => {
      this.idUser = value;
    })
  }

  /* Created form */ 
  createForm() {
    /* If form is created, dont created again */
    if (this.form) return;
      
    /* Create form */
    this.form = this.fb.group({
      station_id: [this.idStation, [Validators.required]],
      code: [, [Validators.required, Validators.maxLength(15), Validators.minLength(3)]],
      name: [, [Validators.required, Validators.maxLength(24), Validators.minLength(4)]],
      symbol: [, [Validators.maxLength(4)]],
      color: [, [Validators.maxLength(7), Validators.minLength(7)]],
      view_human: [],
      switch_case: this.fb.array( [] )
    });
  } 

  createGroupSwitch(): FormGroup {
    return this.fb.group({
      value_max: '',
      value_min: '',
      return: ''
    });
  }

  get groupSwitch(): FormArray {
    return this.form.get('switch_case') as FormArray;
  }

  resetGroupSwitch() {
    let len = this.groupSwitch.length - 1;

    for (var i = len; i >= 0; --i) {  
      this.groupSwitch.removeAt(i);
    }
  }

  addItemSwithCase(numberItem: number): void {
    for (var i = 0; i < numberItem; ++i) {
      this.groupSwitch.push( this.createGroupSwitch() );
    }
  }

  /* Accept modal page */
  onSubmit() {
    let data = this.form.value;
    
    /* As create new variable dont exist last value, then asigned value by default */
    let valueByDefault = 200;

    /* If new view human is null, change to value */
    if( !data['view_human'] ) { data['view_human'] = '*'; }
    
    /* Check if correct View in form */
    this.apiProv.getCheckViewHuman(valueByDefault, data['view_human']).subscribe(
      (check) => {
        let result = check; 
        
        if( !result['correct'] ) {
          data['view_human'] = null;
        }
        
        this.sendCreateVariable(data);
      }
    );
  }

  sendCreateVariable(data: any) {
     /* Send data in API */
     this.apiProv.configVariable(data).subscribe(
      data => {
        /* Call page ConfigVariablePage */
        this.navCtrl.push('ConfigVariablePage', { id: this.idStation });
      },
      error => { 
        /* If exist error show alert error */
        let alert = this.toastCtrl.create({
          message: 'Error, Code has already been taken',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'OK'
        });

        alert.present(); 
      }
    );
  }

  onSubmitTestViewHuman() {
    let view_human = this.form.get('view_human').value;

    /* As create new variable dont exist last value, then asigned value by default */
    let valueByDefault = 200;

    /* If new view human is null, change to value */
    if( !view_human ) { view_human = '*'; }
    
    /* Create loading spinner */
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    /* Show loading spinner */
    loader.present().then(() => {
      /* Get data in API */
      this.apiProv.getCheckViewHuman(valueByDefault, view_human).subscribe(
        (data) => {
          let result = data;  

          /* Show alert with result */
          let alert = this.alertCtrl.create({
            title: result['result'],
            subTitle: result['message'],
            buttons: ['Ok']
          });
          alert.present();

          /* Hide loading spinner */
          loader.dismiss();    
        });
    });
  }

  /* Reset Input Form */
  resetForm() {
    this.form.get('code').reset();
    this.form.get('name').reset();
    this.form.get('symbol').reset();
    this.form.get('color').reset();
    this.form.get('view_human').reset();
  }

  /* Control change select type view human */
  onChangeTypeViewHuman(type_view: any) {
    if( type_view === 'case' ) {
      this.type_viewhuman = 'case';
      this.alertSwitchCase();
    } else if( type_view === 'operation' ) {
      this.type_viewhuman = 'operation';
      this.resetGroupSwitch();
    } else {
      this.type_viewhuman = '';
    }    

    this.form.get('view_human').reset();
  }

  alertSwitchCase() {
    let alert = this.alertCtrl.create();

    alert.setTitle('Enter number of case');
    alert.addInput({ type: 'radio', label: '2', value: '2', checked: true });
    alert.addInput({ type: 'radio', label: '3', value: '3' }); 
    alert.addInput({ type: 'radio', label: '4', value: '4' });
    alert.addInput({ type: 'radio', label: '5', value: '5' });
    alert.addButton('Cancel');

    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.createSwitch(data);
      }
    });
    
    alert.present();    
  }

  createSwitch(numberSelect: any) {    
    switch(numberSelect) { 
      case '2': { 
        this.addItemSwithCase(2);
        break; 
      } 
      case '3': { 
        this.addItemSwithCase(3);
        break; 
      }
      case '4': { 
        this.addItemSwithCase(4);
        break; 
      }
      case '5': { 
        this.addItemSwithCase(5);
        break; 
      } 
    }

    this.onChangeGroupSwitch();
  }

  onChangeGroupSwitch() {
    let len = this.groupSwitch.length;  
    let result = "";

    for (var i = 0; i < this.groupSwitch.length; ++i) {
      if( i == 0 ) {
        result += `if value >= ${this.form.get('switch_case').value[i].value_min} and value <= ${this.form.get('switch_case').value[i].value_max} \n \t '${this.form.get('switch_case').value[i].return}' \n`;
      } else if( i != len - 1) {
        result += `elsif value >= ${this.form.get('switch_case').value[i].value_min} and value <= ${this.form.get('switch_case').value[i].value_max} \n \t '${this.form.get('switch_case').value[i].return}' \n`;
      } else {
        result += `else \n \t '${this.form.get('switch_case').value[i].return}' \n`;
      }
    }

    result += "end"; 
    
    /* Change value of textarea */
    this.form.get('view_human').setValue(result);

    /* Update height of textarea, automatic depend value at textearea */
    this.element.nativeElement.querySelector("textarea").style.height = this.element.nativeElement.querySelector("textarea").scrollHeight + 'px';
  }

  goToHome(id_user: number) {    
    this.navCtrl.push('HomePage', { id: id_user });
  }

  logout() {
    this.storage.clearStorage();
    this.navCtrl.push('LoginPage');
  }

}
