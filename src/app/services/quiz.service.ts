import { Injectable } from "@angular/core";
import { Question } from "../models/question.model";
import { FirebaseService } from "./firebase.service";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { map, switchMap, tap, timestamp } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})

export class QuizService{
    private currentScore = 0;
    private currentUserAnswers: string[] = [];
    private currentQuestion: Question | null = null;

    constructor(private firebaseService: FirebaseService, private authService: AuthService, private http: HttpClient){}

    getRandomQuestion(){
        return this.firebaseService.getQuestions().pipe(map((questions) => {
            if(questions.length === 0) return null;
            const randomIndex = Math.floor(Math.random() * questions.length);
            this.currentQuestion = questions[randomIndex];
            return this.currentQuestion;
        }));
    }

    validateAnswer(userAnswer: string, answers: string[]): number{
        const index = answers.findIndex((answer) => answer.toLowerCase() === userAnswer.toLowerCase());
        return index;
    }

    addCorrectAnswer(answer: string){
        this.currentUserAnswers.push(answer);
        this.currentScore++;
    }

    resetScore(){
        this.currentScore = 0;
        this.currentUserAnswers = [];
    }

    getCurrentScore(): number{
        return this.currentScore;
    }

    getCurrentUserAnswers(): string[]{
        return this.currentUserAnswers;
    }

    submitScore(totalScore: number, userAnswers: string[]){
        const userId = this.authService.getUserId();
        const username = this.authService.getUsername();

        if(!userId || !username){
            console.error('User not authenticated!');
            return;
        }

        return this.http.get<any>(`${environment.firebaseRDBUrl}/users/${userId}.json`).pipe(switchMap((userData) => {
                const currentTotal = userData?.totalScore || 0;
                const newTotal = currentTotal + totalScore;

                return this.http.patch(`${environment.firebaseRDBUrl}/users/${userId}.json`, {totalScore: newTotal});
            }),
            tap(() => {
                this.http.post(`${environment.firebaseRDBUrl}/scores.json`, {
                    userId,
                    username,
                    scoreThisGame: totalScore,
                    userAnswers,
                    timestamp: Date.now(),
                }).subscribe();
            })
        );
    }
}