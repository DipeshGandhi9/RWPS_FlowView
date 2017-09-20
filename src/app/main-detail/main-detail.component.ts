import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../app.service';
import {ActivatedRoute} from '@angular/router';
import { PumpService } from './../pump.service';

@Component({
  selector: 'app-main-detail',
  templateUrl: './main-detail.component.html',
  styleUrls: ['./main-detail.component.css']
})
export class MainDetailComponent implements OnInit, OnDestroy {
  errors = "";
  pumps = [];
  location = "";
  private columnId;
  private detailTimer;

  constructor(private appService : AppService, route: ActivatedRoute,  private pipeService : PumpService) {
    this.columnId = route.snapshot.params['id'];
    // console.log( this.columnId );
    this.getHourlyFlowData();
  }

  ngOnInit() {
    /*Load Pump status on every 30sec.*/
    this.detailTimer = setInterval(() => {
      this.getLatestFlowData();
    }, 30000);
  }

  ngOnDestroy():void {
    clearInterval(this.detailTimer);
  }

  getHourlyFlowData(){
    this.errors = "";

    this.appService.loadChDetail(this.columnId)
      .subscribe(
      (data) => {
        // console.log(data);
        this.pumps = JSON.parse(data["_body"]);
        // console.log(this.pumps);
      },
      (error) => {
        this.errors = "Fail to load pump data.";
      }
    );
  }

  getLatestFlowData(){
    this.errors = "";
    this.appService.loadLatestChData(this.columnId)
      .subscribe(
      (data) => {
        // console.log(data);
        var newData = JSON.parse(data["_body"]);
        var firstRow;
        if(this.pumps.length > 0 ){
          firstRow = this.pumps[0];
        }

        if(firstRow && newData && newData.length > 0 && firstRow.Dated_Time < newData[0].Dated_Time){
          this.pumps.splice(0,0,newData[0]);
        }

      },
      (error) => {
        this.errors = "Fail to load pump data.";
      }
    );
  }

  getPumpKeyDescription(key) {
    this.location = this.pipeService.getPumpKeyDescription(key);
    return this.location;
  }

  getPumpKeyUnit(key):void {
    return this.pipeService.getPumpKeyUnit(key);
  }

  checkValue(pumpValue){
    var validValue = true;
    if(isNaN(Number(pumpValue))){
      validValue = false;
    }
    return validValue;
  }
}
