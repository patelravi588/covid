import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { CovidCollectionService } from 'src/app/services/covid-collection.service';
import { CovidType } from 'src/app/models/covid-type';

@Component({
  selector: 'app-covid-info',
  templateUrl: './covid-info.component.html',
  styleUrls: ['./covid-info.component.scss']
})
export class CovidInfoComponent implements OnInit {
  public categoraziedCovidReport: CovidType;
  public summury = {};
  getClickedState: string = "Delhi";

  constructor( private covidCollection: CovidCollectionService) { }

  ngOnInit() {
   this. getCovidRecord();
  }
  getCovidRecord() {
      // collect covid data from api
      this.covidCollection.getCovidRecord().subscribe((res: any) => {
      let covidReport: any;
      this.categoraziedCovidReport = {
        date: [], 
        activeCases: [], 
        confirmedCases: []
      };
      let response: any = res;
      if(response){ // debugger;
        let length = response.cases_time_series.length - 7; // -7 to get last week info
        let covidReport = response.cases_time_series.slice(length, response.cases_time_series.length);
        // covidReport.map((data) => {
        //   this.categoraziedCovidReport.date.push(data.date);
        // });

        console.log(covidReport);
        if(this.getClickedState === "Maharashtra") {
          covidReport = response.cases_time_series.slice(50, 57);
        }
        // rxJS map operator here, it is return new array 
        covidReport.map((data: any) => {
          this.categoraziedCovidReport.date.length < 7 ? this.categoraziedCovidReport.date.push(data.date):'';
          this.categoraziedCovidReport.activeCases.push(data.dailyconfirmed);
          this.categoraziedCovidReport.confirmedCases.push(data.totalconfirmed);
        });
        // console.log(this.categoraziedCovidReport);
        this.drawChart();
      }
    },
    (error) => {
      console.log(error);
    });
  }
  drawChart(){
    const canvas = <HTMLCanvasElement> document.getElementById('covidChart');
    const ctx = canvas.getContext('2d');

    const labelX = this.categoraziedCovidReport.date;
    const chartData = {
      labels: labelX,
      datasets: [
        {
          label: 'COVID Patient information',
          yAxisID: 'primaryXS',
          data: this.categoraziedCovidReport.activeCases, 
          fill: false,
          backgroundColor: '#e03636',
          borderColor: '#e03636',
          borderWidth: 1
      },
      {
        label: 'COVID Patient information',
        yAxisID: 'secondaryXS',
        data: this.categoraziedCovidReport.confirmedCases, 
        fill: false,
        backgroundColor: '#d3ea11',
        borderColor: '#d3ea11',
        borderWidth: 1
      }
    ]
  };
    const ChartOptions = {
      legend: {
        display: false,
        labels: {
          fontColor: 'rgb(255, 99, 132)',
          fontSize: 30,
          padding: 30
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
            position: "left",
            id: "primaryXS",
            type: "linear",
            scaleLabel: {
              display: true,
              labelString: 'Confirmed Cases',
              fontSize: 18,
              fontColor: '#d3ea11'
            },
            ticks: {
                beginAtZero: true
            }
        }, {
          position: "right",
          id: "secondaryXS",
          type: 'linear',
          scaleLabel: {
            display: true,
            labelString: 'Active Patient',
            fontSize: 18,
            fontColor: '#e03636'
          }
        }]
      },
    };
    var myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: ChartOptions 
    });
  }

  receivedState($event){
    this.getClickedState  = $event;
    this.getCovidRecord();
  }
}
