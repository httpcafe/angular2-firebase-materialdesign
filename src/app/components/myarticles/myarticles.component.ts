import {Component, Inject, Input, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseApp} from 'angularfire2';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-myarticles',
    templateUrl: 'myarticles.component.html',
    styleUrls: ['myarticles.component.css']
})
export class MyArticlesComponent implements OnInit {
    articleStream: FirebaseListObservable<any[]>;
    parentRouter;
    _storage_: any;
    images = [];
    db;
    userid: string;

    @Input()
    uid: string;


    ngOnInit() {
        const self = this;

        this.authService.isAuthenticated().subscribe(authData => {
            if (authData) {

                // console.log('userid: ', self.uid);


                if (self.uid) {
                    self.userid = self.uid;
                } else {
                    self.userid = authData.uid;
                }


                // console.log(self.uid, self.userid);
                this.articleStream = self.db.list('/sandbox/news/' + self.userid, {
                    query: {
                        orderByChild: 'timestamp',
                        limitToLast: 200
                    }
                });

            } else {
                this.parentRouter.navigate(['/user']);
            }
        });
    }


    constructor(@Inject(FirebaseApp) firebaseApp: any,
                af: AngularFire,
                private authService: AuthService,
                router: Router) {
        this._storage_ = firebaseApp.storage();
        this.parentRouter = router;
        this.db = af.database;
    }


    createItem() {
        this.articleStream.push({
            title: 'De titel van een sprankelend nieuw artikel',
            content: '<p>Schrijf een goeie inleiding en een goed slot.<br>Probeer het boeiend te houden!<br>' +
            'Links en bronnen apart invoeren onder deze editor.</p>',
            type: 'blog'
        }).then(result => {
            // console.log(result);
            this.parentRouter.navigate(['/mijn-artikelen/' + this.userid + '/' + result.key]);
        });
    }

    since(timestamp) {
        const passed = Math.round((new Date().getTime() + timestamp) / 1000);

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
    }


}
