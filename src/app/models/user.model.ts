export class User{
    constructor(public id: string, public email: string, public username: string, public token: string, 
        public tokenExpirationDate: Date, public role: string){

    }
}