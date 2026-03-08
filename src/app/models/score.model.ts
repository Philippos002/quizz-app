export class Score{
    constructor(public id: string, public userId: string, public username: string, 
        public totalScore: number, public userAnswers: string[], public timestamp: number){

    }
}