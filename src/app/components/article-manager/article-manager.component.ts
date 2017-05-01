import {Component, Inject} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseApp} from 'angularfire2';
import {AuthService} from '../../services/auth.service';


@Component({
    selector: 'app-article-manager',
    templateUrl: './article-manager.component.html',
    styleUrls: ['./article-manager.component.css']
})
export class ArticleManagerComponent {
    authorStream: FirebaseListObservable<any[]>;
    ckeditorContent: string;
    selecteditem: any;
    deleteItem: any;
    _storage_: any;
    images = [];
    config = {toolbar: 'Basic', uiColor: '#FFFFFF'};

    constructor(@Inject(FirebaseApp) firebaseApp: any, af: AngularFire, private authService: AuthService) {

        this.authService.isAuthenticated().subscribe(authData => {
            if (authData) {
                this.authorStream = af.database.list('/sandbox/news/', {
                    query: {
                        orderByChild: 'timestamp',
                        limitToLast: 200
                    }
                });
            } else {
                // forward to login page
            }
        });


        this._storage_ = firebaseApp.storage();
    }

    onChange(event) {
    }

    onReady(event) {
    }

    onFocus(event) {
    }

    onBlur(event) {
    }




    selectItem(article) {
        const self = this;
        this.selecteditem = article;

        if (!this.selecteditem.hasOwnProperty('urls')) {
            this.selecteditem.urls = {};
        }

        self.selecteditem.urlArray = [];
        Object.keys(this.selecteditem.urls).forEach(function (key) {
            const tmpUrl = self.selecteditem.urls[key];
            tmpUrl['key'] = key;
            self.selecteditem.urlArray.push(tmpUrl);
        });

        this.deleteItem = null;
    }

    selectDeleteItem(article) {
        this.selecteditem = null;
        this.deleteItem = article;
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

    createItem() {
        this.authorStream.push({
            title: 'De titel van een sprankelend nieuw artikel',
            content: 'Schrijf een goeie inleiding en een goed slot.<br>Probeer het boeiend te houden!<br>Links en bronnen apart invoeren onder deze editor.',
            type: 'blog'
        });
    }


    delete(selecteditem) {
        this.authorStream.remove(selecteditem.$key);
        this.selecteditem = null;
        this.deleteItem = null;
    }

    addUrl(selecteditem, name, url) {
        if (url !== '') {

            selecteditem.urlArray.push({
                key: this.makeid(),
                name: name,
                url: url
            });
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
