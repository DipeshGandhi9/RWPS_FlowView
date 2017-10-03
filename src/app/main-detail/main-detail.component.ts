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
  private zeroDetailTimer;
  private zeroFlowId = "342";


  constructor(private appService : AppService, route: ActivatedRoute,  private pumpService : PumpService) {
    this.columnId = route.snapshot.params['id'];
    // console.log( this.columnId );

    if(this.columnId === 'ZERO_POINT'){
      this.loadZeroChDetailData(this.zeroFlowId);
      this.setZeroLatestDataTimer();
    }else{
      this.getHourlyFlowData();
      this.setLatestDataTimer();
    }

  }

  private setZeroLatestDataTimer():void {
    /*Load Pump status on every 30sec.*/
    this.zeroDetailTimer = setInterval(() => {
      this.getZeroLatestFlowData(this.zeroFlowId);
    }, 30000);
  }

  private setLatestDataTimer():void {
    /*Load Pump status on every 30sec.*/
    this.detailTimer = setInterval(() => {
      this.getLatestFlowData();
    }, 30000);
  }

  ngOnInit() {
   /* /!*Load Pump status on every 30sec.*!/
    this.detailTimer = setInterval(() => {
      this.getLatestFlowData();
    }, 30000);*/
  }

  ngOnDestroy():void {
    if(this.zeroDetailTimer){
      clearInterval(this.zeroDetailTimer);
    }else{
      clearInterval(this.detailTimer);
    }

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
         console.log(data);
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
    this.location = this.pumpService.getPumpKeyDescription(key);
    return this.location;
  }

  getPumpKeyUnit(key):void {
    return this.pumpService.getPumpKeyUnit(key);
  }

  checkValue(pumpValue){
    var validValue = true;
    if(isNaN(Number(pumpValue))){
      validValue = false;
    }
    return validValue;
  }

  private loadZeroChDetailData(id:string):void {
    this.errors = "";

    this.appService.loadZeroChDetail(id)
      .subscribe(
      (data) => {
        //console.log(data);
        var newData = JSON.parse(data["_body"]);
        if(newData.length > 0){
          for(var i=newData.length-1; i>=0; i--){
            var row = {'Dated_Time': newData[i]['SampleTime'],
              'ZERO_POINT': newData[i]['Analog2'],
            };
            this.pumps.splice(0,0,row);
          }
        }
        //console.log(this.pumps);
      },
      (error) => {
        this.errors = "Fail to load pump data.";
      }
    );
  }

  getZeroLatestFlowData(id:string):void {
    this.errors = "";
    this.appService.loadZeroLatestChData(id)
      .subscribe(
      (data) => {
        //console.log("zero",data);
        var newData = JSON.parse(data["_body"]);
        var firstRow;
        if(this.pumps.length > 0 ){
          firstRow = this.pumps[0];
        }

        if(firstRow && newData && newData.length > 0 && firstRow.Dated_Time < newData[0].SampleTime){
          var row = {'Dated_Time': newData[0]['SampleTime'],
            'ZERO_POINT': newData[0]['Analog2'],
          };
          this.pumps.splice(0,0,row);
        }

      },
      (error) => {
        this.errors = "Fail to load pump data.";
      }
    );
  }

  getPumpValue(value,key){
    var digitalPumpList = this.pumpService.getDigitalPumpList();
    var selected = digitalPumpList.find(k => k == key);
    // var selected = digitalPumpList.filter(k => k == key);

    if(selected){
      if(value > 0 || value.toUpperCase() == "ON"){
        return 'ON';
      }else {
        return 'OFF'
      }
    }
    return value;
  }


}
