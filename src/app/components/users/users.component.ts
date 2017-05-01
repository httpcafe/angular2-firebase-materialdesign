import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.css']
})
export class UsersComponent {
  publicUserdataStream: FirebaseListObservable<any[]>;
  users: any;

  constructor(public af: AngularFire) {
    const self = this;

    self.af.auth.subscribe(auth => {
      if (auth) {
        // console.log('You are authenticated');

        af.database.list('/users/public/', {
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
        // console.log('You are not authenticated');
      }
    });
  }
}
