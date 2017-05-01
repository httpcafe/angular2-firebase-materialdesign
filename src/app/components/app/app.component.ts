import {Component, OnDestroy, OnInit, enableProdMode} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {MessagingService} from '../../services/messaging.service';
import {Subscription} from 'rxjs/Subscription';
import {FirebaseObjectObservable} from 'angularfire2';
import {PodcastService} from '../../services/podcast.service';

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [AuthService, UserService, MessagingService, PodcastService]
})
export class AppComponent implements OnInit, OnDestroy {
  privateUserdata: FirebaseObjectObservable<any[]>;
  publicUserdata: FirebaseObjectObservable<any[]>;
  public uid: string;
  private sub: Subscription;
  public currentPodcast;
  public podcastVisibility = true;

  ngOnInit() {
    this.sub = this.authService.isAuthenticated().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  constructor(private authService: AuthService,
              private userService: UserService,
              private messagingService: MessagingService,
              private podcastService: PodcastService) {
    this.authService.isAuthenticated().subscribe(authData => {
      if (authData) {
        this.uid = authData.uid;
        this.privateUserdata = this.userService.getPrivateUserdata(authData.uid);
        this.publicUserdata = this.userService.getPublicUserdata(authData.uid);
      } else {
        this.privateUserdata = this.userService.getPrivateUserdata('');
      }
    });

    this.currentPodcast = this.podcastService.currentPodcast;
    // podcastService.subscribe(this.loadPodcast);
  }

  login() {
    this.authService.login('google');
  }

  logout() {
    this.privateUserdata = this.userService.getPrivateUserdata('');
    this.publicUserdata = this.userService.getPublicUserdata('');
    this.authService.logout();
  }

  closePodcast() {
    this.currentPodcast.podcast = '';
  }

  hidePodcast() {
    this.podcastVisibility = false;
  }
  showPodcast() {
    this.podcastVisibility = true;
  }


}
