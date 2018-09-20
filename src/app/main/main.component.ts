import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../app.service';
import { PumpService } from './../pump.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  title = 'Welcome !';
  errors = "";
  pumps = [];
  private timer;

  constructor(private appService : AppService, private pumpService : PumpService) {
    this.getHourlyFlowData();
  }

  ngOnInit() {
    /*Load Pump status on every 30sec.*/
    this.timer = setInterval(() => {
      this.getHourlyFlowData();
    }, 30000);

  }

  ngOnDestroy():void {
    clearInterval(this.timer);
  }


  getHourlyFlowData(){
    this.errors = "";
    this.appService.loadChData()
      .subscribe(
      (data) => {
        console.log(data);
        var newData = JSON.parse(data["_body"]);
        if(this.pumps.length > 0 ){
          this.pumps = null;
        }
        this.pumps = newData;
        this.loadZeroFlowData();

        console.log(this.pumps);
      },
      (error) => {
        this.errors = "Fail to load pump data.";
      }
    );
  }

  getPumpKeyDescription(key):void {
    return this.pumpService.getPumpKeyDescription(key);
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

  loadZeroFlowData(){
    this.appService.loadZeroChData()
      .subscribe(
        (data) => {
          console.log(data);
          var newData = JSON.parse(data["_body"]);
          if(newData.length > 0){

            for(var i = newData.length-1; i >= 0; i--) {
              var unitKey = this.pumpService.getZeroFlowKey(newData[i]['UnitID']+'-t');
              var row = {'Dated_Time': newData[i]['SampleTime']};
              row[unitKey] = newData[i]['TF1'];
              this.pumps.splice(0,0,row);

              unitKey = this.pumpService.getZeroFlowKey(newData[i]['UnitID']+"");
              row = {'Dated_Time': newData[i]['SampleTime']};
                row[unitKey] = newData[i]['Analog1'];
              this.pumps.splice(0,0,row);
            }
          }

          console.log(this.pumps);
        },
        (error) => {
          this.errors = "Fail to load Zero flow data.";
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
