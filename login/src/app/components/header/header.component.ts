import { Component, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { AccountsService } from '../../services/accounts.service';
import { Subscription } from 'rxjs'
import { Account } from 'src/app/Account';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  loginTitle: string = 'Login/Register';
  profileTitle: string = 'Welcome!';
  showLogin: boolean = true;
  isLoggedIn: boolean = false;
  isWaiting: boolean = false;
  subscription: Subscription;

  constructor(private uiService: UiService, private accountsService: AccountsService) {
    this.subscription = this.uiService.onToggle()
    .subscribe((value) => (this.showLogin = value));
    this.subscription = this.uiService.onWaiting()
    .subscribe((value) => (this.isWaiting = value));
    this.subscription = this.uiService.onLogin()
    .subscribe((value) => (this.isLoggedIn = value));
  }

  ngOnInit(): void {
    /*this.accountsService.getAccounts().subscribe(
      (accounts) => {
        this.accounts = accounts;
      }
    );*/
  }

  toggleLogin() {
    this.uiService.toggleLogin();
  }

  addAccount(account: Account) {
    this.uiService.toggleWaiting();
    this.accountsService.getAccounts().subscribe(
      (accounts) => (this.attemptAddAccount(account, accounts))
    );
  }

  attemptAddAccount(target: Account, accounts: Account[]) {
    var compare = accounts.find((e) => (
         e.username === target.username 
    ));

    if (compare !== undefined) {
      alert("Username is taken :(");
      this.uiService.toggleWaiting();
      return;
    }

    this.accountsService.createAccount(target).subscribe(() => (this.onSuccessfulAccountAdd()));
  }

  onSuccessfulAccountAdd(): void {
    this.uiService.toggleWaiting();
    this.uiService.toggleLogin();
    alert("Account created successfully, you may now login.")
  }

  onLogin(target: Account) {
    this.uiService.toggleWaiting();
    this.accountsService.getAccounts().subscribe(
      (accounts) => (this.attemptLogin(target, accounts))
    );
  }

  attemptLogin(target: Account, accounts: Account[]): void {
    var compare = accounts.find((e) => (
         e.username === target.username 
      && e.password === target.password
    ));

    if (compare === undefined) {
      alert("Login failed, incorrect credentials.");
      this.uiService.toggleWaiting();
      return;
    }
    
    this.uiService.toggleLogInState();
    this.uiService.toggleWaiting();
    this.uiService.setUsername(target.username);
  }
}
