import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-feedback',
  templateUrl: 'feedback.component.html',
  styleUrls: ['feedback.component.css']
})
export class FeedbackComponent {
  items: FirebaseListObservable<any[]>;

  constructor(af: AngularFire,
              private activatedRoute: ActivatedRoute) {

    const self = this;
    self.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.items = af.database.list('/feedback/' + params['id']);
    });

  }
}
