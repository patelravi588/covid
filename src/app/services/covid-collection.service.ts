import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { CovidType } from '../models/covid-type';
@Injectable({
  providedIn: 'root'
})
export class CovidCollectionService {

  private dataSource: string = 'https://api.covid19india.org/data.json';
  private numberAPI: string = 'http://numbersapi.com';
  
  public constructor(private httpClient: HttpClient) { }

  // get request to collect covid record
  public getCovidRecord(): Observable<Object> {
    const covidCasesUrl: string = this.dataSource;
    return this.httpClient.get(covidCasesUrl, {responseType: "json" });
  }
  // get label from number API
  public getLableAsTooltip(number: Number): Observable<any> {
    const numberAPIUrl: string = this.numberAPI + `/${number}`;
    return this.httpClient.get(numberAPIUrl, { responseType: 'text' });
  }

  
}