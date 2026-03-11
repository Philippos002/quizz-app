import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  username: string = '';
  totalScore: number = 0;
  quizzesPlayed: number = 0;
  bestScore: number = 0;
  isLoading = false;

  constructor(private authService: AuthService, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData(){
    this.isLoading = true;
    const userId = this.authService.getUserId();

    if(!userId){
      console.error('User is not authenticated!');
      return;
    }

    this.firebaseService.getUserProfile(userId).subscribe({
      next: (userData) => {
        this.username = userData.username;
        this.totalScore = userData.totalScore;
      },
      error: (err) => {
        console.error('Error while loading user profile!', err);
      },
    });

    this.firebaseService.getQuizzesPlayedCount(userId).subscribe({
      next: (count) => {
        this.quizzesPlayed = count;
      },
      error: (err) => {
        console.error('Error while loading quizzes count!', err);
        this.quizzesPlayed = 0;
      },
    });

    this.firebaseService.getBestScore(userId).subscribe({
      next: (bestScore) => {
        this.bestScore = bestScore;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error while loading best score!', err);
        this.bestScore = 0;
        this.isLoading = false;
      },
    });
  }
}
