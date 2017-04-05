import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-profile',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.css']
})
export class UsersComponent {
  userdata: FirebaseListObservable<any[]>;
  users: any;

  constructor(public af: AngularFire) {
    const self = this;

    self.af.auth.subscribe(auth => {
      if (auth) {
        console.log('You are authenticated');

        af.database.list('/users/', {
          query: {
            orderByChild: 'familienaam'
          }
        }).subscribe(items => {
          self.users = [];
          items.forEach(item => {
            item['key'] = item.$key;
            if (item.$key !== 'undefined') {
              this.users.push(item);
            }
          });
        });
      } else {
        console.log('You are not authenticated');
      }
    });
  }
}