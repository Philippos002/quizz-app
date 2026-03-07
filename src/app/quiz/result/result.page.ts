import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  username: string = 'Filip';
  score: number = 3;

  constructor() { }

  ngOnInit() {
  }

}
