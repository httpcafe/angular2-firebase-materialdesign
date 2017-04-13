import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Injectable()
export class FeedbackService {

  constructor(public af: AngularFire) {
  }

  getFeedback(id): FirebaseListObservable<any[]> {
    return this.af.database.list('/feedback/' + id);
  }

}
