import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
    selector: 'podcasts',
    templateUrl: './podcast.component.html',
    styleUrls: ['./podcast.component.css']
})
export class PodcastComponent {
    title = 'Podcasts!';
    items: FirebaseListObservable<any[]>;

    constructor(af: AngularFire) {
        this.items = af.database.list('/podcast', {
            query: {
                orderByChild: 'datetime',
                limitToLast: 50
            }
        });
        console.log(this.items);
    }
}
