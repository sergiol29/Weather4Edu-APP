import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/do';
/*
  Generated class for the LocalstorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalstorageProvider {

  constructor(public http: HttpClient, private storage: Storage) {
    //console.log('Hello LocalstorageProvider Provider');
  }

  /* Create a Session user */
  setUser(id: number, email: any){
    this.storage.set('id_user', id);
    this.storage.set('email', email);
  }

  /* Get UserID */
  getUserID() {
    return this.storage.get('id_user').then((id) => { 
      return id;
    });
  }

  /* Check if user have a Session */
  isUserActive() {
    return this.storage.get('email').then((value) => { 
      /* If value not null, user have a session */
      if( value ) { return true; } else { return false; }
    });
  }
 
  /* Clear file at Storage and clean Session */
  clearStorage() {
    this.storage.clear().then(()=>{ });
  }
}
