import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'app-newsitem',
  templateUrl: 'newsitem.component.html',
  styleUrls: ['newsitem.component.css']
})
export class NewsitemComponent {
  newsItem: FirebaseObjectObservable<any[]>;

  constructor(af: AngularFire,
              private activatedRoute: ActivatedRoute) {

    const self = this;
    self.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.newsItem = af.database.object('/news/' + params['id']);
    });

  }
}


