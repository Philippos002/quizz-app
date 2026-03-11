import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

interface UserScore{
  id: string;
  email: string;
  username: string;
  role: string;
  totalScore: number;
  rank?: number;
}

@Component({
  standalone: false,
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  users: UserScore[] = [];
  isLoading = false;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard(){
    this.isLoading = true;

    this.firebaseService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.sort((a,b) => b.totalScore - a.totalScore);
        this.users = this.users.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        console.log('Leaderboard loaded: ', this.users);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error while loading leaderboard!', err);
        this.isLoading = false;
      },
    });
  }
}
