import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ComboBoxComponent } from './components/combo-box/combo-box.component';

@NgModule({
  declarations: [
    AppComponent,
    ComboBoxComponent
  ],
  imports: [
    BrowserModule, NgbModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
