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

  stationsCopy: any;

  /* Observable  */
  private stations = new BehaviorSubject<any>([]);
  private filtered_stations = new BehaviorSubject<any>([]);

  constructor(public http: HttpClient) {
    //console.log('Hello ApiProvider Provider');
  }

  /* Observable */
  get stations$() {
    return this.stations.asObservable();
  }

  /* Observable */
  get filteredStations$() {
    return this.filtered_stations.asObservable();
  }

  /* get all station in API */
  getAllStation() {
    const url = `${CONFIG.API_URL}/devices_latest_data`;
    return this.http.get(url).do( (data) => {
      this.stationsCopy = data;
      this.stations.next(data);
      this.filtered_stations.next(data);
    });
  }

  /* get show data of station with from and to timestamp*/
  getShowStation(id:number, from:number, to:number) {
    const url = `${CONFIG.API_URL}/device_data/${id}?from=${from}&to=${to}`;
    return this.http.get(url);
  }

  doFilterStation(query: string) {
    if (query == '') {
      this.filtered_stations.next(this.stationsCopy);
    }
    const result = this.stationsCopy.filter((item) => {
      return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    this.filtered_stations.next(result);
  }
}
