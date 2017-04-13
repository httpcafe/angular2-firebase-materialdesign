import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-sources',
  templateUrl: 'sources.component.html',
  styleUrls: ['sources.component.css']
})
export class SourcesComponent {
  items: FirebaseListObservable<any[]>;

  constructor(af: AngularFire,
              private activatedRoute: ActivatedRoute) {

    const self = this;
    self.activatedRoute.params.subscribe(params => {
      this.items = af.database.list('/sources/' + params['id']);
    });

  }
}
