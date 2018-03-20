import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) {
    //console.log('Hello ApiProvider Provider');
  }

  /* get all heroes in API */
  getAllStation() {
    const url = `${CONFIG.API_URL}/devices_latest_data`;
    return this.http.get(url);
  }

  getShowStation(id:number) {
    const url = `${CONFIG.API_URL}/device_data/${id}`;
    return this.http.get(url);
  }

  getShowStationFromTo(id:number, from:any, to:any) {
    const url = `${CONFIG.API_URL}/device_data/${id}?from=${from}&to=${to}`;
    return this.http.get(url);
  }

}
