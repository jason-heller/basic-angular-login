import { Component, Output, EventEmitter } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { AccountsService } from '../../services/accounts.service';
import { Subscription } from 'rxjs'
import { Account } from 'src/app/Account';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  @Output() btnDeleteClick = new EventEmitter();

  isLoggedIn: boolean = false;
  isWaiting: boolean = false;
  subscription: Subscription;

  changePass: boolean = false;

  pass: string = '';
  confirm: string = '';

  constructor(private uiService: UiService, private accountsService: AccountsService) {
    this.subscription = this.uiService.onLogin()
    .subscribe((value) => (this.isLoggedIn = value));
    this.subscription = this.uiService.onWaiting()
    .subscribe((value) => (this.isWaiting = value));
  }

  onDeleteAccount() {
    this.uiService.toggleWaiting();
    this.accountsService.getAccounts().subscribe(
      (accounts) => (this.attemptDeletion(
        this.uiService.getUsername(), accounts))
    );
  }

  attemptDeletion(targetUsername: string, accounts: Account[]) {
    var compare = accounts.find((e) => (
      e.username === targetUsername
    ));

    if (compare === undefined) {
      alert("Account deletion failed :(");
      return;
    }

    this.accountsService.deleteAccount(compare).subscribe(
      () => (this.onSuccessfulDeletion())
    )
  }

  onSuccessfulDeletion() {
    alert("Account has been deleted!")
    this.onLogout();
  }

  onUpdateClick() {
    if (this.pass === '' || this.confirm === '') {
      alert("Please fill out all fields.");
      return;
    }

    if (this.pass !== this.confirm) {
      alert("Passwords don't match.");
      return;
    }

    this.uiService.toggleWaiting();
    this.accountsService.getAccounts().subscribe(
      (accounts) => (this.attemptUpdate(
        this.uiService.getUsername(), accounts))
    );
  }

  attemptUpdate(targetUsername: string, accounts: Account[]) {
    var compare = accounts.find((e) => (
      e.username === targetUsername
    ));

    if (compare === undefined) {
      alert("Password change failed :(");
      return;
    }

    compare.password = this.pass;
    
    this.pass = '';
    this.confirm = '';

    this.accountsService.updatePassword(compare).subscribe(
      () => (this.onSuccessfulUpdate())
    )
  }

  onSuccessfulUpdate() {
    alert("Password has been updated, you will now be logged out.")
    this.onLogout();
    this.uiService.toggleWaiting();
  }

  onLogout() {
    this.uiService.toggleLogInState();
    this.changePass = false;
  }
}
