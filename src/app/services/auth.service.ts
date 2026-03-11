import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { switchMap, tap } from "rxjs";
import { FirebaseService } from "./firebase.service";

interface AuthResponseData{
    kind: string;
    idToken: string;
    email: string;
    //refreshToken: string;
    localId: string;
    expiresIn: string;
    registered?: boolean;
}

interface UserData{
    username?: string;
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})

export class AuthService{
    private _isUserAuthenticated = false;
    user: User | null | undefined;

    constructor(private http: HttpClient, private firebaseService: FirebaseService){

    }

    get isUserAuthenticated(): boolean{
        return this._isUserAuthenticated;
    }

    register(user: UserData){
        this._isUserAuthenticated = true;

        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
            {
                email: user.email,
                password: user.password,
                returnSecureToken: true,
            }
        ).pipe(tap((resData) => {
            const expirationTime = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);

            const newUser = new User(
                resData.localId,
                resData.email,
                user.username || 'User',
                resData.idToken,
                expirationTime,
                'user',
                0
            );

            this.user = newUser;

            this.saveUserToDatabase(newUser);
        }));
    }

    logIn(user: UserData){
        this._isUserAuthenticated = true;

        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
                email: user.email,
                password: user.password,
                returnSecureToken: true,
            }
        ).pipe(switchMap((resData) => {
            return this.http.get<any>(`${environment.firebaseRDBUrl}/users/${resData.localId}.json`)
            .pipe(tap((userDataFromDB) => {
                const expirationTime = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);

                const newUser = new User(
                resData.localId,
                resData.email,
                userDataFromDB?.username || 'User',
                resData.idToken,
                expirationTime,
                userDataFromDB?.role || 'user',
                userDataFromDB?.totalScore || 0
            );

            this.user = newUser;
            }));
        }));
    }

    logOut(){
        this._isUserAuthenticated = false;
        this.user = null;
    }

    private saveUserToDatabase(user: User){
        const userData = {
            email: user.email,
            username: user.username,
            role: user.role,
            totalScore: 0
        };

        this.http.put(`${environment.firebaseRDBUrl}/users/${user.id}.json`, userData)
        .subscribe({
            next: () => console.log('User is saved in DB!'),
            error: (err) => console.error('Error while saving user to DB!', err)
        });
    }

    getToken(){
        if(this.user){
            return this.user.token;
        }
        else return null;
    }

    getUserId(){
        if(this.user){
            return this.user.id;
        }
        else return null;
    }

    getUsername(){
        if(this.user){
            return this.user.username;
        }
        else return null;
    }

    isAdmin(): boolean{
        return this.user?.role === 'admin';
    }
}