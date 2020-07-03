import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CovidInfoComponent } from './component/covid-info/covid-info.component'

const routes: Routes =[
  { path: '', component: CovidInfoComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class Covid19RoutingModule { }
