import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  username: string = 'Filip';
  totalScore: number = 45;
  quizzesPlayed: number = 9;
  bestScore: number = 5;

  constructor() { }

  ngOnInit() {
  }

}
