import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../app.service';
import { PumpService } from './../pump.service';
import { DateFormatPipe } from './../pipes/dateFormatPipe';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  title = 'Welcome !';
  errors = "";
  pumps = [];
  perDayFlow = [];
  private timer;
  startDate = new Date();
  endDate = new Date();
  dateFormatPipe = new DateFormatPipe();

  constructor(private appService : AppService, private pumpService : PumpService) {
    // this.getHourlyFlowData();
    this.loadSMCData();
  }

  ngOnInit() {
    /*Load Pump status on every 30sec.*/
    // this.timer = setInterval(() => {
    //   this.getHourlyFlowData();
    // }, 30000);

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

  // getColspan(key):any {
  //   if(key == "Date_Time"){
  //     return 3;
  //   }
  //   return 1;
  // }

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
            var row = {'Dated_Time': newData[0]['SampleTime'],
                        'ZERO_POINT': newData[0]['Analog2'],
                      };
            this.pumps.splice(0,0,row);
          }

          // console.log(this.pumps);
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
    }else if(key == "Date_Time"){
      return this.dateFormatPipe.transform(value, 'dd-MM-yyyy h:mm a');
    }
    return value;
  }

  dateChangeHandler = function() {
    // console.log("Change called...");
    this.loadSMCData();
  };

  loadSMCData(){
    var startDate = this.dateFormatPipe.transform(this.startDate, "yyyy/MM/dd");
    var endDate = this.dateFormatPipe.transform(this.endDate, "yyyy/MM/dd");

    // console.log("Start Date " + this.dateFormatPipe.transform(this.startDate, 'yyyy/MM/dd HH:mm:ss'));
    // console.log("End Date " + this.dateFormatPipe.transform(this.endDate, 'yyyy/MM/dd HH:mm:ss'));

    this.appService.loadSMCDataByDate(startDate, endDate)
      .subscribe(
        (data) => {
          // console.log(data);
          var newData = JSON.parse(data["_body"]);
          if(newData.length > 0){
            // var row = {'Dated_Time': newData[0]['SampleTime'],
            //   'ZERO_POINT': newData[0]['Analog2'],
            // };
            // this.pumps.splice(0,0,row);
            this.pumps = newData;
          }

          // console.log(this.pumps);
        },
        (error) => {
          this.errors = "Fail to load smc data.";
        }
      );

    this.appService.loadSMCPerDayDataByDate(startDate, endDate)
      .subscribe(
        (data) => {
          // console.log(data);
          var newData = JSON.parse(data["_body"]);
          if(newData.length > 0){
            // var row = {'Dated_Time': newData[0]['SampleTime'],
            //   'ZERO_POINT': newData[0]['Analog2'],
            // };
            // this.pumps.splice(0,0,row);
            this.perDayFlow = newData;
          }

          // console.log(this.perDayFlow);
        },
        (error) => {
          this.errors = "Fail to load per day data.";
        }
      );
  }

}
