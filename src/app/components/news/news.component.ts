import {Component, Input} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {WindowRefService} from '../../services/window-ref.service';

@Component({
  selector: 'app-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.css']
})
export class NewsComponent {

  items: FirebaseListObservable<any[]>;
  windowRef: WindowRefService;
  _window;

  @Input()
  listOnly: boolean;
  limit: number;


  constructor(af: AngularFire, windowRef: WindowRefService) {
    this._window = windowRef.nativeWindow;
    if (!this.limit) {
      this.limit = 50;
    }

    this.items = af.database.list('/news', {
      query: {
        orderByChild: 'published',
        limitToFirst: this.limit
      }
    });
  }

  urlify(str) {
    return str.replace(new RegExp(' ', 'g'), '-');
  }

  gototop(): void {
    console.log('yep');
    this._window.scrollTo(0, 0);
  }
}
