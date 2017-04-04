import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
    selector: 'app-news',
    templateUrl: 'news.component.html',
    styleUrls: ['news.component.css']
})
export class NewsComponent {
    title = 'Newss!';
    items: FirebaseListObservable<any[]>;

    constructor(af: AngularFire) {
        this.items = af.database.list('/news', {
            query: {
                orderByChild: 'published',
                limitToLast: 200
            }
        });
    }
}
