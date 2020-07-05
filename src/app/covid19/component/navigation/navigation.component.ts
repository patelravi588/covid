import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor() { }
  clickedState: string = null;
  states: ['Delhi', 'Maharastra'];
  @Output() cureentState = new EventEmitter<string>();
  ngOnInit() {
  }
  onChange(stateVal) {
    this.clickedState = stateVal;
    this.cureentState.emit(this.clickedState)
    console.log("Clicked State:",this.clickedState);
  }
}


