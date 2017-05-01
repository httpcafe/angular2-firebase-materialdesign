import {Injectable} from '@angular/core';

@Injectable()
export class PodcastService {

  public currentPodcast: any;
  subscribers = [];


  constructor() {
    const self = this;


    this.currentPodcast = {
      podcast: {},
      counter: 0
    };
  }

  subscribe(func) {
    this.subscribers.push(func);
  }

  getCurrentPodcast(): any {
    return this.currentPodcast;
  }

  setCurrentPodcast(currPodcast): any {
    this.currentPodcast.podcast = currPodcast;
    return this.currentPodcast;
  }


}
