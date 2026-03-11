import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';
import { Question } from 'src/app/models/question.model';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  standalone: false,
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit, OnDestroy {

  question: Question | null = null;
  slots: (string | null)[] = [null, null, null, null, null];
  answerInput: string = '';
  score: number = 0;
  timeRemaining: number = 60;
  isLoading = false;
  quizFinished = false;

  private timerSubscription: any;
  private destroy$ = new Subject<void>();

  constructor(private quizService: QuizService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.initializeQuiz();
  }

  ionViewWillEnter(){
    this.initializeQuiz();
  }

  private initializeQuiz(){
    if(this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }

    this.timeRemaining = 60;
    this.quizFinished = false;
    this.score = 0;
    this.answerInput = '';
    this.slots = [null, null, null, null, null];
    this.isLoading = false;
    this.question = null;

    this.quizService.resetScore();

    this.loadQuestion();
    this.startTimer();
  }
  
  ngOnDestroy() {
    if(this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadQuestion(){
    this.isLoading = true;
    this.quizService.resetScore();

    this.quizService.getRandomQuestion().subscribe({
      next: (question) => {
        if(question){
          this.question = question;
          this.slots = [null, null, null, null, null];
          this.score = 0;
          console.log('Question loaded: ', question);
        } else{
          console.error('No questions available!');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error while loading question!', err);
        this.isLoading = false;
      },
    });
  }

  startTimer(){
    this.timerSubscription = interval(1000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if(!this.quizFinished){
        this.timeRemaining--;

        if(this.timeRemaining <= 0){
          console.log('Time is up!');
          this.finishQuiz();
        }
      }
    });
  }

  onKeyPress(event: KeyboardEvent){
    if(event.key == 'Enter'){
      this.checkAnswer();
    }
  }

  checkAnswer(){
    if(!this.question || !this.answerInput.trim()){
      return;
    }

    const userAnswer = this.answerInput.trim();
    const answerIndex = this.quizService.validateAnswer(userAnswer, this.question.answers);

    if(answerIndex !== -1){
      if(this.slots[answerIndex] === null){
        const correctAnswer = this.question.answers[answerIndex];
        this.slots[answerIndex] = correctAnswer;
        this.score++;
        this.quizService.addCorrectAnswer(correctAnswer);

        console.log('Correct!');

        if(this.score === 5){
          console.log('All answers correct! Finishing quiz...');
          this.finishQuiz();
        }
      } else{
        console.log('You already guessed that!');
      }
    }else{
      console.log('Incorrect!');
    }

    this.answerInput = '';
  }

  finishQuiz(){
    if(this.quizFinished) return;

    this.quizFinished = true;
    this.isLoading = true;

    const finalScore = this.quizService.getCurrentScore();
    const userAnswers =  this.quizService.getCurrentUserAnswers();

    console.log('Final score: ', finalScore);
    console.log('User answers: ', userAnswers);

    const submitObservable = this.quizService.submitScore(finalScore, userAnswers);

    if(submitObservable){
      submitObservable.subscribe({
        next: () => {
        console.log('Score submitted to DB!');
        this.isLoading = false;
        this.router.navigateByUrl('/result');
        },
        error: (err) => {
          console.error('Error while submitting score!', err);
          this.isLoading = false;
          this.router.navigateByUrl('/result');
        },
      });
    } else{
      console.error('submitScore is undefined!');
      this.isLoading = false;
      this.router.navigateByUrl('/result');
    }
  }
}
