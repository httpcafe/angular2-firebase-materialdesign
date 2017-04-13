import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { MetaService } from '@nglibs/meta';

@Component({
  selector: 'app-newsitem',
  templateUrl: 'newsitem.component.html',
  styleUrls: ['newsitem.component.css']
})
export class NewsitemComponent implements OnInit {
  newsItem: FirebaseObjectObservable<any[]>;


  ngOnInit() {
    this.metaService.setTag('og:url', 'https://httpcafemagazine.firebaseapp.com/news/Zend-Framework-3-is-gelanceerd./-KLQIWQwRzRDH-os9GVh');
    this.metaService.setTag('og:description', 'Michael zal zien dat het werkt!');
    this.metaService.setTitle('Aangepast in de component');
    this.metaService.setTag('og:image', 'https://www.w3schools.com/images/compatible_chrome.gif');
  }

  constructor(af: AngularFire,
              private activatedRoute: ActivatedRoute,
              private metaService: MetaService) {

    const self = this;
    self.activatedRoute.params.subscribe(params => {
     // console.log(params);
      this.newsItem = af.database.object('/news/' + params['id']);
    });

  }

  urlify(str) {
    return str.replace(new RegExp(' ', 'g'), '-').substring(0, 30);
  }

}


