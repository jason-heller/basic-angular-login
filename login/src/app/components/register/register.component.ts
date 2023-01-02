import { Component, Output, EventEmitter } from '@angular/core';
import { Account } from 'src/app/Account';
import { UiService } from '../../services/ui.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  @Output() btnBackClick = new EventEmitter();
  @Output() onAddAccount: EventEmitter<Account> = new EventEmitter();

  user: string = "";
  pass: string = "";
  confirm: string = "";

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
    this.btnBackClick.emit();
  }

  onRegisterClick() {
    if (!this.user) {
      alert("Please enter a username");
      return;
    }
    else if (!this.pass || !this.confirm) {
      alert("Please fill out the password fields");
      return;
    }
    else if (this.pass !== this.confirm) {
      alert("Passwords don't match");
      return;
    }

    const newAccount = {
      username: this.user,
      password: this.pass
    }

    this.user = '';
    this.pass = '';
    this.confirm ='';

    this.onAddAccount.emit(newAccount);
  }
}
