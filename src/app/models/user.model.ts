export class User{
    constructor(public id: string, public email: string, public username: string, public token: string, 
        public tokenExpirationDate: Date, public role: string = 'user', public totalScore: number = 0){

    }

    get tokenDurationInSeconds(){
        if(!this.tokenExpirationDate){
            return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
    }

    get shouldAutoLogout(){
        return this.tokenDurationInSeconds < 60000;
    }
}