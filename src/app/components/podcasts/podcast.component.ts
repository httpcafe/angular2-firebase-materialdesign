import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {PodcastService} from '../../services/podcast.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: 'podcast.component.html',
  styleUrls: ['podcast.component.css']
})
export class PodcastsComponent {
  title = 'HTTP Café Podcast!';
  items: FirebaseListObservable<any[]>;

  constructor(af: AngularFire,
              public podcastService: PodcastService) {
    this.items = af.database.list('/podcasts', {
      query: {
        orderByChild: 'datetime',
        limitToLast: 50
      }
    });
    // console.log(this.items);
  }

  playPodcast(currPodcast) {
    this.podcastService.setCurrentPodcast(currPodcast);
  }
}
