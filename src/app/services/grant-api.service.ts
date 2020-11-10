import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Grant } from './model/grant';

@Injectable({
  providedIn: 'root'
})
export class GrantApiService {

  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };
  selectedGrant: Grant = new Grant();
  grants: Grant[];

  constructor(private http: HttpClient) { }

  saveGrant(grant: Grant) {   
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    };
    //console.log("Save Grant: "+JSON.stringify(grant));  
    return this.http.post(environment.apiBaseUrl + '/savegrant', grant,options);
  }

  getGrantList() {
    return this.http.get(environment.apiBaseUrl + '/');
  }

  updateGrant(id: string, grant: Grant) {
    return this.http.put(environment.apiBaseUrl + '/updategrant' + `/${id}`, grant);
  }

  deleteGrant(id: string) {
    return this.http.delete(environment.apiBaseUrl + '/deletegrant' + `/${id}`);
  }
}
