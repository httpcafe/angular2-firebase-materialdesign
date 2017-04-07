import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {MessagingService} from '../../services/messaging.service';
import {Subscription} from 'rxjs/Subscription';
import {FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [AuthService, UserService, MessagingService]
})
export class AppComponent implements OnInit, OnDestroy {
  userdata: FirebaseObjectObservable<any[]>;
  public uid: string;
  private sub: Subscription;


  ngOnInit() {
    this.sub = this.authService.isAuthenticated().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  constructor(private authService: AuthService, private userService: UserService, private messagingService: MessagingService) {
    this.authService.isAuthenticated().subscribe(authData => {
      if (authData) {
        this.uid = authData.uid;
        this.userdata = this.userService.getUserdata(authData.uid);
      } else {
        this.userdata = this.userService.getUserdata('');
      }
    });
  }

  login() {
    this.authService.login('google');
  }

  logout() {
    this.userdata = this.userService.getUserdata('');
    this.authService.logout();
  }
}
