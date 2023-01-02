import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class UiService {

  private isLogin: boolean = true;
  private isWaiting: boolean = false;
  private isLoggedIn: boolean = false;
  private username: string = '';

  private subjectLogin = new Subject<any>();
  private subjectWaiting = new Subject<any>();
  private subjectLoggedIn = new Subject<any>();

  constructor() { }

  toggleLogin(): void {
    this.isLogin = !this.isLogin;
    this.subjectLogin.next(this.isLogin);
  }

  toggleWaiting(): void {
    this.isWaiting = !this.isWaiting;
    this.subjectWaiting.next(this.isWaiting);
  }

  toggleLogInState(): void {
    this.isLoggedIn = !this.isLoggedIn;
    this.subjectLoggedIn.next(this.isLoggedIn);
  }

  onToggle(): Observable<any> {
    return this.subjectLogin.asObservable();
  }

  onWaiting(): Observable<any> {
    return this.subjectWaiting.asObservable();
  }

  onLogin(): Observable<any> {
    return this.subjectLoggedIn.asObservable();
  }

  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }
}
