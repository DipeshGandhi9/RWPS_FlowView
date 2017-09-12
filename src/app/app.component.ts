import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome !';
  errors = "";
  pumps = [];

  constructor(private appService : AppService) {
    this.getHourlyFlowData();
    /*Load Pump status on every 30sec.*/
    setInterval(() => {
      this.getLatestFlowData();
    }, 30000);
  }

  getHourlyFlowData(){
    this.errors = "";
    this.appService.loadChData()
      .subscribe(
        (data) => {
          console.log(data);
          this.pumps = JSON.parse(data._body);
          console.log(this.pumps);
        },
        (error) => {
          this.errors = "Fail to load pump data.";
        }
      );
  }

  getLatestFlowData(){
    this.errors = "";
    this.appService.loadLatestChData()
      .subscribe(
        (data) => {
          //console.log(data);
          var newData = JSON.parse(data._body);
          var firstRow;
          if(this.pumps.length > 0 ){
            firstRow = this.pumps[0];
          }

          if(firstRow && newData && newData.length > 0 && firstRow.SampleTime < newData[0].SampleTime){
            this.pumps.splice(0,0,newData[0]);
          }

        },
        (error) => {
          this.errors = "Fail to load pump data.";
        }
      );
  }
}
