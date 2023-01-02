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
  subscription: Subscription;

  constructor(private uiService: UiService, private accountsService: AccountsService) {
    this.subscription = this.uiService.onLogin()
    .subscribe((value) => (this.isLoggedIn = value));
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
    this.uiService.toggleLogInState();
    this.uiService.toggleLogin();
  }
}
