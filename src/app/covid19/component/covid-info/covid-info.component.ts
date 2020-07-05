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
  public summury = { activeCase : 0, confirmedCases: 0}; // using reduce function
  getClickedState: string = "Delhi";

  constructor( private covidCollection: CovidCollectionService) { }

  ngOnInit() {
   this. getCovidRecord();
  }
  getCovidRecord() {
    this.categoraziedCovidReport = {
      date: [], 
      activeCases: [], 
      confirmedCases: [],
      activeLabelAsToolTip: [],
      confirmedLabelAsToolTip: []
    };
    var activetooltipItem: any;
    var confirmedTooltipItem: any;
      // collect covid data from api
      this.covidCollection.getCovidRecord().subscribe((res: any) => {
      let response: any = res;
      if(response){
        let length = response.cases_time_series.length - 7; // -7 to get one week info
        let covidReport = response.cases_time_series.slice(length, response.cases_time_series.length);
        // covidReport.map((data) => {
        //   this.categoraziedCovidReport.date.push(data.date);
        // });
        if(this.getClickedState === "Maharashtra") {
          covidReport = response.cases_time_series.slice(90, 97);
        }
        // rxJS map operator here, this return new array 
        covidReport.map((data: any) => {
          this.categoraziedCovidReport.date.length < 7 ? this.categoraziedCovidReport.date.push(data.date):'';
          this.categoraziedCovidReport.activeCases.push(parseInt(data.dailyconfirmed)-parseInt(data.dailyrecovered));
          this.categoraziedCovidReport.confirmedCases.push(parseInt(data.dailyconfirmed));
        });
        activetooltipItem = this.categoraziedCovidReport.activeCases; 
        confirmedTooltipItem = this.categoraziedCovidReport.confirmedCases; 

        this.getActiveLableAsTooltip(activetooltipItem); 
        this.getConfirmedLableAsTooltip(confirmedTooltipItem);

        this.summury.activeCase = this.categoraziedCovidReport.activeCases.reduce((a,b) => a+b);
        this.summury.confirmedCases = this.categoraziedCovidReport.confirmedCases.reduce((a,b) => a+b);
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
          yAxisID: 'primaryXS',
          data: this.categoraziedCovidReport.activeCases, 
          fill: false,
          backgroundColor: '#e03636',
          borderColor: '#e03636',
          borderWidth: 1
      },
      {
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
      tooltips: { 
        callbacks: {
          label: (tooltipItem, data) => {
            return this.showLabel(tooltipItem);
          }
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
   /* call number api to get custom label on data points in chart */
   getActiveLableAsTooltip(activetooltipItem): void {
    this.covidCollection.getLableAsTooltip(activetooltipItem).subscribe((res) => {
      this.categoraziedCovidReport.activeLabelAsToolTip = JSON.parse(res);
    });
  }

  /* call number api to get custom label on data points in chart */
  getConfirmedLableAsTooltip(confirmedTooltipItem): void { 
  this.covidCollection.getLableAsTooltip(confirmedTooltipItem).subscribe((res) => {
   this.categoraziedCovidReport.confirmedLabelAsToolTip = JSON.parse(res);
  });
}

showLabel(tooltipItem){ //debugger;
  let label: any;
  let tooltipValues ={};
  tooltipValues = {...this.categoraziedCovidReport.activeLabelAsToolTip, ...this.categoraziedCovidReport.confirmedLabelAsToolTip}
  return tooltipValues[tooltipItem.value];
}
  
}
