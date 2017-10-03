import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AppService {

  private zeroFlowHost = "http://123.63.212.28:3000";

  constructor(public http:Http) { }

  loadZeroChData(){
    return this.http.get(this.zeroFlowHost + '/api/chdata');
  }

  loadZeroChDetail(UnitID:any){
    let myParams = new URLSearchParams();
    myParams.append('id', UnitID);
    let options = new RequestOptions({params: myParams });
    return this.http.get(this.zeroFlowHost + '/api/chdetail',options);
  }

  loadZeroLatestChData(UnitID:any){
    let myParams = new URLSearchParams();
    myParams.append('id', UnitID);
    let options = new RequestOptions({params: myParams });
    return this.http.get(this.zeroFlowHost + '/api/chdata/latest',options);
  }

  loadChData(){
    return this.http.get('/api/chdata');
  }

  loadChDetail(columnId:any){
    let myParams = new URLSearchParams();
    myParams.append('id', columnId);
    let options = new RequestOptions({params: myParams });
    return this.http.get('/api/chdetail',options);
  }

  loadLatestChData(columnId:any) : Observable<any>{
    let myParams = new URLSearchParams();
    myParams.append('id', columnId);
    let options = new RequestOptions({params: myParams });
    return this.http.get('/api/chdata/latest', options);
  }

  private fnExtractData(res:Response) {
    let body = res;
    return body || {};
  }

  private fnHandleError(error:any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
