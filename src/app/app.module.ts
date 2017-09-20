import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule, JsonpModule} from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { PumpService } from './pump.service';
import { MainComponent } from './main/main.component';
import { MainDetailComponent } from './main-detail/main-detail.component'

import { KeysPipe } from './pipes/keys';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MainDetailComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot([
      { path: '', component: MainComponent },
      { path: 'main/:id', component: MainDetailComponent }
    ])
  ],
  providers: [
    AppService,
    PumpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
