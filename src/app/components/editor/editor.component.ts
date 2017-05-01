import {Component, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFire, FirebaseObjectObservable, FirebaseApp} from 'angularfire2';
import {AuthService} from '../../services/auth.service';


@Component({
    selector: 'app-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css']
})
export class EditorComponent {
    articleStream: FirebaseObjectObservable<any[]>;
    parentRouter;
    db;
    userid;
    urlArray = [];
    key: string;
    _storage_: any;
    images = [];
    config = {removePlugins: 'elementspath,toolbar', uiColor: '#FFFFFF'};
    confirmdeletion = false;


    constructor(@Inject(FirebaseApp) firebaseApp: any,
                af: AngularFire,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                router: Router) {
        const self = this;
        this.parentRouter = router;
        this._storage_ = firebaseApp.storage();
        this.db = af.database;

        this.authService.isAuthenticated().subscribe(authData => {
            if (authData) {
                self.activatedRoute.params.subscribe(params => {
                    self.key = params['id'];
                    self.userid = params['uid'];
                    // console.log(params);
                    self.articleStream = af.database.object('/sandbox/news/' + params['uid'] + '/' + params['id']);
                    self.articleStream.take(1).subscribe(snapshot => {
                        // console.log(snapshot);
                    }).unsubscribe();
                });
            } else {
                this.parentRouter.navigate(['/user']);
            }
        });
    }

    saveArticle(title, content, type) {

        this.articleStream.take(1).subscribe(snapshot => {
            if ((snapshot.title !== title) || (snapshot.content !== content) || (snapshot.type !== type)) {
                this.articleStream.update({'timestamp': -new Date().getTime()});
            }
        }).unsubscribe();

        this.articleStream.update({'title': title});
        this.articleStream.update({'content': content});
        this.articleStream.update({'type': type});
    }

    deleteArticle() {
        if (this.confirmdeletion) {
            this.db.object('/feedback/sandbox_' + this.key).remove().then(_ => {
                this.articleStream.remove();
                this.parentRouter.navigate(['/mijn-artikelen']);
            });
        }
    }

    publishArticle() {
        const self = this;

        self.articleStream.take(1).subscribe(snapshot => {
            const newArticle = {};
            newArticle[snapshot.$key] = snapshot;
            if (snapshot.timestamp) {
                newArticle[snapshot.$key]['published'] = snapshot.timestamp;
            } else {
                newArticle[snapshot.$key]['published'] = - this.now();
            }
            newArticle[snapshot.$key]['author'] = {};
            newArticle[snapshot.$key]['author']['uid'] = self.userid;
            // console.log(newArticle);

            self.db.object('/news/').update(newArticle).then(_ => {
                self.db.object('/feedback/sandbox_' + this.key).remove().then(__ => {
                    self.articleStream.remove();
                    self.parentRouter.navigate(['/news']);
                });
            }).catch(_ => {
                this.articleStream.update({'askforpublish': true});
            });
        }).unsubscribe();
    }

    uploadImage(event) {
        const self = this;
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const ref = this._storage_.ref().child('news/' + this.key + '/' + file.name);

            ref.put(file).then(snapshot => {
                ref.getDownloadURL().then(url => {
                    self.articleStream.update({'banner': snapshot.downloadURL});
                });
            });
        }
    }


    removeUrl(selecteditem, urlkey) {
        selecteditem.urlArray = selecteditem.urlArray.filter(function (obj) {
            return obj.key !== urlkey;
        });
    }

    addUrl(selecteditem, name, url) {
        if (url !== '') {

            this.urlArray.push({
                key: this.makeid(),
                name: name,
                url: url
            });
        }
    }


    now() {
        return new Date().getTime();
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


    makeid() {
        let text = '-';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 20; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
