import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { User } from './user';
import { error } from '@angular/compiler/src/util';
import { Time } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseurl = "";

  constructor(private http: HttpClient) { }


  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseurl + '/login', { username: username, password: password }).map(
      data => {
        return data;
      }
    )
  }

  getBands(): Observable<any> {
    return this.http.post('/bands', {}).map(
      data => {
        console.log('got bands:', data);
        return data;
      }
    );

  }
  uploadBand(data: FormData): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post('/uploadBand', data, { headers: headers, reportProgress: true }).map(
      data => {
        console.log(data);
        return data;
      }
    );
  }

  updateBand(data: FormData): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-type', 'multipart/form-data');
    headers.append('Accept', 'application-json');
    return this.http.post('/updateBand', data, { headers: headers, reportProgress: true }).map(
      data => {
        console.log(data);
        return data;
      }
    );
  }

  deleteBand(bandId: any): Observable<any> {
    return this.http.post('/deleteBand', { bandId: bandId }).map(
      data => {
        console.log(data);
        return data;
      }
    );
  }

  updatePassword(form: any): Observable<any> {
    console.log('the form vales are:',form.username,form.password,form.newPassword);
    return this.http.post('/updatePassword', { username: form.username, password: form.password, newPassword: form.newPassword }).map(
      data => {
        console.log(data);
        return data;
      }
    );
  }
}
