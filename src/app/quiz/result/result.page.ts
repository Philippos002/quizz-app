import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  standalone: false,
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  username: string = '';
  score: number = 0;

  constructor(private authService: AuthService, private quizService: QuizService, private router: Router) { }

  ngOnInit() {
    this.username = this.authService.getUsername() || 'User';
    this.score = this.quizService.getCurrentScore();
  }

  playAgain(){
    this.quizService.resetScore();
    this.router.navigateByUrl('/quiz');
  }

  goToLeaderboard(){
    this.router.navigateByUrl('/leaderboard');
  }

  exit(){
    this.router.navigateByUrl('/home');
  }

}
