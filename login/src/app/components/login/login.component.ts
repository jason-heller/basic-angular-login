import { Component, Output, EventEmitter } from '@angular/core';
import { UiService } from '../../services/ui.service'
import { Subscription } from 'rxjs'
import { Account } from 'src/app/Account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() btnRegisterClick = new EventEmitter();
  @Output() onLogin: EventEmitter<Account> = new EventEmitter();
  
  user: string = "";
  pass: string = "";

  showLogin: boolean = true;
  isWaiting: boolean = false;
  subscription: Subscription;

  constructor(private uiService: UiService) {
    this.subscription = this.uiService.onToggle()
    .subscribe((value) => (this.showLogin = value));
    this.subscription = this.uiService.onWaiting()
    .subscribe((value) => (this.isWaiting = value));
  }

  onLoginClick() {
    if (!this.user || !this.pass) {
      alert("Please fill out both fields");
      return;
    }

    const loginAccount = {
      username: this.user,
      password: this.pass
    }

    this.onLogin.emit(loginAccount);

    this.user = '';
    this.pass = '';
  }

  onRegisterClick() {
    this.btnRegisterClick.emit();
  }
}
