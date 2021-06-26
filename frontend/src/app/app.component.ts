import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor( private auth: AuthService){

  }
  setTimeout() {
    this.auth.userActivity = setTimeout(() => {
      if (this.auth.usuario !== null && this.auth.usuario !== undefined) {
        this.auth.userInactive.next(undefined);
        this.auth.logout();
      }
    }, 180000);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.auth.userActivity);
    this.setTimeout();
  }
}
