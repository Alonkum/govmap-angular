import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovmapComponent } from './govmap.component';
import { Routes, RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
const routes: Routes = [
  {
    path: "",
    component: GovmapComponent
  }];

@NgModule({
  declarations: [GovmapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GoogleMapsModule,
    HttpClientModule
  ],
  exports: [GovmapComponent]
})
export class GovMapModule { }
