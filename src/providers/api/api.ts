import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  /* API KEY ACCUWEATHER */
  apikey = "CXal3U2IA8HAkiqGARcK8AqKLitxjjRo";

  httpOptions: any = { 
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

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

  /* Check if exist User in API */
  getUserLogin(email: any, password: any) {
    const url = `${CONFIG.API_URL}/login_user?email=${email}&password=${password}`;
    return this.http.get(url);
  }

  /* get all station in API */
  getAllStation(idUser: number) {
    const url = `${CONFIG.API_URL}/stations_user/${idUser}`;
    return this.http.get(url).do( (data) => {
      this.stationsCopy = data;
      this.stations.next(data);
      this.filtered_stations.next(data);
    });
  }

  /* get show data of station with from and to timestamp*/
  getShowStation(id:number, from:number, to:number) {
    const url = `${CONFIG.API_URL}/station_lasted_data/${id}?from=${from}&to=${to}`;
    return this.http.get(url);
  }

  /* get show values maxes of station */
  getValuesMaxes(id:number) {
    const url = `${CONFIG.API_URL}/values_maxes_station/${id}`;
    return this.http.get(url);
  }

  /* get show values mins of station */
  getValuesMins(id:number) {
    const url = `${CONFIG.API_URL}/values_mins_station/${id}`;
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

  /*  update station */ 
  putUpdateStation(id:number, data:any) {
    const url = `${CONFIG.API_URL_INPUT}/update_station/${id}`;
    return this.http.put(url, data, this.httpOptions);
  }

  /*  add variable */ 
  configVariable(data:any) {
    const url = `${CONFIG.API_URL_INPUT}/create_variables`;
    return this.http.post(url, data, this.httpOptions);
  }

  /* get variable of users */
  getVariablesStation(id:number) {
    const url = `${CONFIG.API_URL}/variables_station/${id}`;
    return this.http.get(url);
  }

  /* get variable */
  getDataVariables(id:number) {
    const url = `${CONFIG.API_URL}/data_variables/${id}`;
    return this.http.get(url);
  }

  /*  update Variable */ 
  putUpdateVariable(id:number, data:any) {
    const url = `${CONFIG.API_URL}/data_variables/${id}`;
    return this.http.put(url, data, this.httpOptions);
  }

  /* delete variable of users */
  destroyVariablesStation(id:number) {
    const url = `${CONFIG.API_URL_INPUT}/delete_variables/${id}`;
    return this.http.delete(url);
  }

  getKeyCity(latitude: number, longitude: number) {
    /* Get KEY city */
    const url = `${CONFIG.API_ACCUWEATHER}/locations/v1/cities/geoposition/search?apikey=${this.apikey}&q=${latitude}%2C${longitude}`;
    return this.http.get(url);
  }

  getWeatherForecasts5days(keycity: number){
    const url = `${CONFIG.API_ACCUWEATHER}/forecasts/v1/daily/5day/${keycity}?apikey=${this.apikey}&details=true&metric=true`;
    return this.http.get(url);
  }

  getCheckViewHuman(value: number, view_human: any) {
    const data = {
      "value": value,
      "view_human": view_human
    }
    const url = `${CONFIG.API_URL_INPUT}/test_viewhumans`;
    return this.http.post(url, data, this.httpOptions);
  }
}
