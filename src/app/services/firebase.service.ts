import { Injectable } from "@angular/core";
import { BehaviorSubject, map, switchMap, take, tap, timestamp } from "rxjs";
import { Question } from "../models/question.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

interface QuestionData{
    questionText: string;
    answers: string[];
    createdBy: string;
}

@Injectable({
    providedIn: 'root',
})

export class FirebaseService{
    private _questions = new BehaviorSubject<Question[]>([]);

    constructor(private http: HttpClient){

    }

    get questions(){
        return this._questions.asObservable();
    }

    getQuestions(){
        return this.http.get<{[key: string]: QuestionData}>(`${environment.firebaseRDBUrl}/questions.json`)
        .pipe(
            map((questionsData) => {
                const questions: Question[] = [];

                for(const key in questionsData){
                    if(questionsData.hasOwnProperty(key)){
                        questions.push({
                            id: key,
                            questionText: questionsData[key].questionText,
                            answers: questionsData[key].answers,
                            createdBy: questionsData[key].createdBy,
                        });
                    }
                }
                return questions;
            }),
            tap((questions) => {
                this._questions.next(questions);
            })
        );
    }

    getQuestion(id: string){
        return this.http.get<QuestionData>(`${environment.firebaseRDBUrl}/questions/${id}.json`)
        .pipe(
            map((resData) => {
                return{
                    id,
                    questionText: resData.questionText,
                    answers: resData.answers,
                    createdBy: resData.createdBy,
                };
            })
        );
    }

    addQuestion(questionText: string, answers: string[], createdBy: string){
        let generatedId: string;

        return this.http.post<{name: string}>(`${environment.firebaseRDBUrl}/questions.json`, {
            questionText,
            answers,
            createdBy,
        }).pipe(
            switchMap((resData) => {
                generatedId = resData.name;
                return this._questions;
            }),
            take(1),
            tap((questions) => {
                this._questions.next(
                    questions.concat({
                        id: generatedId,
                        questionText,
                        answers,
                        createdBy,
                    })
                );
            })
        );
    }

    deleteQuestion(id: string){
        return this.http.delete(`${environment.firebaseRDBUrl}/questions/${id}.json`)
        .pipe(
            switchMap(() => {
                return this._questions;
            }),
            take(1),
            tap((questions) => {
                this._questions.next(questions.filter((q) => q.id !== id));
            })
        );
    }

    editQuestion(id: string, questionText: string, answers: string[], createdBy: string){
        return this.http.put(`${environment.firebaseRDBUrl}/questions/${id}.json`,
            { 
                questionText,
                answers,
                createdBy,
            }
        ).pipe(
            switchMap(() => this._questions),
            take(1),
            tap((questions) => {
                const updatedQuestionIndex = questions.findIndex((q) => q.id === id);
                const updatedQuestions = [...questions];
                updatedQuestions[updatedQuestionIndex] = {
                    id,
                    questionText,
                    answers,
                    createdBy,
                };
                this._questions.next(updatedQuestions);
            })
        );
    }

    saveScore(userId: string, username: string, totalScore: number, userAnswers: string[]){
        return this.http.post(`${environment.firebaseRDBUrl}/scores.json`, {
            userId,
            username,
            totalScore,
            userAnswers,
            timestamp: Date.now(),
        });
    }

    getScores(){
        return this.http.get<{[key: string]: any}>(`${environment.firebaseRDBUrl}/scores.json`)
        .pipe(
            map((scoresData) => {
                const scores: any[] = [];

                for(const key in scoresData){
                    if(scoresData.hasOwnProperty(key)){
                        scores.push({
                            id: key,
                            ...scoresData[key],
                        });
                    }
                }
                return scores;
            })
        );
    }

    getAllUsers(){
        return this.http.get<{[key: string]: any}>(`${environment.firebaseRDBUrl}/users.json`).pipe(map((usersData) => {
            const users: any[] = [];

            for(const key in usersData){
                if(usersData.hasOwnProperty(key)){
                    users.push({
                        id: key,
                        email: usersData[key].email,
                        username: usersData[key].username,
                        role: usersData[key].role,
                        totalScore: usersData[key].totalScore || 0,
                    });
                }
            }
            return users;
        }));
    }
}