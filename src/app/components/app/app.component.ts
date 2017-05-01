import {Component, OnDestroy, OnInit, enableProdMode} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {MessagingService} from '../../services/messaging.service';
import {Subscription} from 'rxjs/Subscription';
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import {PodcastService} from '../../services/podcast.service';

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [AuthService, UserService, MessagingService, PodcastService]
})
export class AppComponent implements OnInit, OnDestroy {
  privateUserdata: FirebaseObjectObservable<any>;
  publicUserdata: FirebaseObjectObservable<any>;
  chatsStream: FirebaseListObservable<any>;
  public uid: string;
  public newMessages: number;
  private sub: Subscription;
  public currentPodcast;
  public podcastVisibility = true;

  ngOnInit() {
    this.sub = this.authService.isAuthenticated().subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  constructor(private af: AngularFire,
              private authService: AuthService,
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

      this.privateUserdata.subscribe(snapshot => {

        af.database.list('/messenger/' + authData.uid + '/overview', {
          query: {
            orderByChild: 'm',
            startAt: snapshot.messengerLastSeen
          }
        }).subscribe(subsnapshot => {
          this.newMessages = subsnapshot.length - 1;
        });
      });
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
