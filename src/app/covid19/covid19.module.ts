import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidInfoComponent } from './component/covid-info/covid-info.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { Covid19RoutingModule } from './covid19-routing.module';


@NgModule({
  declarations: [
    CovidInfoComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule,
    Covid19RoutingModule
  ],
  exports: [
    CovidInfoComponent, 
    NavigationComponent
  ]
})
export class Covid19Module { }
