import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-urls',
  templateUrl: 'urls.component.html',
  styleUrls: ['urls.component.css']
})
export class UrlsComponent implements OnInit {

  @Input()
  urls: any;
  urlArray = [];


  ngOnInit() {
    const self = this;

    if (self.urls) {
      console.log(self.urls);
      Object.keys(self.urls).forEach(function (key) {
        self.urlArray.push(self.urls[key]);
        // console.log(key, self.urls[key]);
      });
    }

  }
}
