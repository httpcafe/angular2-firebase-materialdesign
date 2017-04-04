import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';


@Component({
  selector: 'app-magazine',
  templateUrl: 'magazine.component.html',
  styleUrls: ['magazine.component.css']
})
export class MagazineComponent {

  items: FirebaseListObservable<any[]>;
  title = 'Magazine!';

  constructor(af: AngularFire) {
    this.items = af.database.list('/news', {
      query: {
        orderByChild: 'type',
        limitToLast: 1,
        equalTo: 'magazine'
      }
    });

    // console.log(this.items);
  }
}
