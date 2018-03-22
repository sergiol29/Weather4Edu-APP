import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  /* Observable  */
  private stations = new BehaviorSubject<any>([]);

  constructor(public http: HttpClient) {
    //console.log('Hello ApiProvider Provider');
  }

  /* Observable */
  get stations$() {
    return this.stations.asObservable();
  }

  /* get all station in API */
  getAllStation() {
    const url = `${CONFIG.API_URL}/devices_latest_data`;
    return this.http.get(url).do( (data) => {
      this.stations.next(data);
    });
  }

  /* get show data of station with from and to timestamp*/
  getShowStation(id:number, from:number, to:number) {
    const url = `${CONFIG.API_URL}/device_data/${id}?from=${from}&to=${to}`;
    return this.http.get(url);
  }

}
