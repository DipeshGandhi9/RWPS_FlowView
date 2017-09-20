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

  constructor(private appService : AppService, private pipeService : PumpService) {
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

        console.log(this.pumps);
      },
      (error) => {
        this.errors = "Fail to load pump data.";
      }
    );
  }

  getPumpKeyDescription(key):void {
    return this.pipeService.getPumpKeyDescription(key);
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
