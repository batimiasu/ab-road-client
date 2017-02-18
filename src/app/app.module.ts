import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HttpService } from "./http.service";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {DetailComponent} from "./detail.commponent";

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    JsonpModule,
    Ng2BootstrapModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
