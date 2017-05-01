import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'app-videocasts',
  templateUrl: 'videocast.component.html',
  styleUrls: ['videocast.component.css']
})
export class VideoCastsComponent {
  title = 'HTTP Café Vlog';
  items: FirebaseListObservable<any[]>;

  constructor(af: AngularFire, private sanitizer: DomSanitizer) {
    af.database.list('/videocasts', {
      query: {
        orderByChild: 'datetime',
        limitToLast: 10
      }
    }).take(1).subscribe(snapshot => {
      this.items = snapshot;
      this.items.forEach(item => {
        item['safeurl'] = this.sanitizer.bypassSecurityTrustResourceUrl(item['url'].replace('/watch?v=', '/embed/'));
      });
    }).unsubscribe();
  }
}
