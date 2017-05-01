import {Component, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFire, FirebaseListObservable, FirebaseApp} from 'angularfire2';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';


@Component({
    selector: 'app-messenger',
    templateUrl: 'messenger.component.html',
    styleUrls: ['messenger.component.css']
})
export class MessengerComponent {
    newText = '';
    chatStream: FirebaseListObservable<any[]>;
    chatsStream: FirebaseListObservable<any[]>;
    parentRouter;
    db;
    uid: string;
    _storage_: any;
    you: string;


    constructor(@Inject(FirebaseApp) firebaseApp: any,
                af: AngularFire,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                private userService: UserService,
                router: Router) {
        const self = this;
        this.parentRouter = router;
        this._storage_ = firebaseApp.storage();
        this.db = af.database;

        this.authService.isAuthenticated().subscribe(authData => {
            if (authData) {
                self.uid = authData.uid;

                this.userService.updateMessengerLastSeen(this.userService.getPrivateUserdata(authData.uid));

                self.activatedRoute.params.subscribe(params => {
                    if (params.hasOwnProperty('uid')) {

                        self.you = params['uid'];
                        self.chatStream = self.db.list('/messenger/' + authData.uid + '/' + self.you, {
                            query: {
                                orderByChild: 'm',
                                limitToLast: 10
                            }
                        });
                    } else {

                        self.chatsStream = self.db.list('/messenger/' + authData.uid + '/overview', {
                            query: {
                                orderByChild: 'm'
                            }
                        });
                    }
                });
                /*
                 self.userid = params['uid'];
                 console.log(params);
                 self.chatStream.take(1).subscribe(snapshot => {
                 console.log(snapshot);
                 }).unsubscribe();
                 });
                 */
            } else {
                this.parentRouter.navigate(['/user']);
            }
        });
    }

    postMessage(title, content, type) {

        const self = this;

        if (self.you) {
            self.db.list('/messenger/' + self.uid + '/' + self.you).push({
                a: 'me',
                t: self.newText,
                m: new Date().getTime()
            }).then(_ => {
                self.userService.updateMessengerLastSeen(self.userService.getPrivateUserdata(self.uid));
                self.db.list('/messenger/' + self.you + '/' + self.uid).push({
                    a: 'you',
                    t: self.newText,
                    m: new Date().getTime()
                }).then(_ => {
                    self.newText = '';
                });

            });
        }


    }


    since(timestamp) {

        const date = new Date(timestamp);
        const passed = Math.round((new Date().getTime() - timestamp) / 1000);
        if (timestamp === undefined) {
            return '';
        } else if (passed < 82800) {
            return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        } else {
            return Math.round(passed / 86400) + ' dagen geleden';
        }
        /*

         console.log(passed);

         if (timestamp === undefined) {
         return '';
         } else if (passed < 60) {
         return 'minder dan een minuut';
         } else if (passed < 3600) {
         return Math.round(passed / 60) + 1 + ' minuten geleden';
         } else if (passed < 82800) {
         return Math.round(passed / 3600) + 1 + ' uur geleden';
         } else {
         return Math.round(passed / 86400) + ' dagen geleden';
         }
         */
    }

}
