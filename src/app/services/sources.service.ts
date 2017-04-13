import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Injectable()
export class SourcesService {

  constructor(public af: AngularFire) {
  }

  getSources(id): FirebaseListObservable<any[]> {
    return this.af.database.list('/sources/' + id);
  }

}
