import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { UserI } from '../models/user';
import { DataUser, UsuarioBD } from '../models/jwt-response';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()


export class AuthService {

 AUTH_SERVER = 'http://localhost:3000';
 authSubject = new BehaviorSubject(false);

 userActivity;
 userInactive: Subject<any> = new Subject();

 usuario: DataUser;

 private token: string;

 constructor( private httpClient: HttpClient,
              private router: Router){}

 login(user: UserI): Promise<UsuarioBD> {

   return this.httpClient.post<UsuarioBD>(`${this.AUTH_SERVER}/user/login`, user).toPromise();

 }

 logout(): void {
    this.token = '';
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EXPIRES_IN');
    this.usuario = null;
    this.router.navigateByUrl('/login');
 }

 saveToken(token: string, expiresIn: string): void {
   localStorage.setItem('ACCESS_TOKEN', token);
   localStorage.setItem('EXPIRES_IN', expiresIn);
   this.token = token;
 }

  getToken(): string {

   if (!this.token){
     this.token = localStorage.getItem('ACCESS_TOKEN');
   }
   return this.token;
 }

}











