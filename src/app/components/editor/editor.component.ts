import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {AuthService} from '../../services/auth.service';
import {forEach} from "@angular/router/src/utils/collection";


@Component({
  selector: 'app-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
})
export class EditorComponent {
  articleStream: FirebaseListObservable<any[]>;
  ckeditorContent: string;
  selecteditem: any;
  deleteItem: any;


  constructor(af: AngularFire, private authService: AuthService) {

    this.authService.isAuthenticated().subscribe(authData => {
      if (authData) {
        this.articleStream = af.database.list('/sandbox/news/' + authData.uid, {
          query: {
            orderByChild: 'timestamp',
            limitToLast: 200
          }
        });
      } else {
        // forward to login page
      }
    });
  }

  onChange(event) {
    console.log(event);
  }

  onReady(event) {
    console.log(event);
  }

  onFocus(event) {
    console.log(event);
  }

  onBlur(event) {
    console.log(event);
  }

  selectItem(article) {
    const self = this;
    this.selecteditem = article;

    if (!this.selecteditem.hasOwnProperty('urls')) {
      this.selecteditem.urls = {};
    }

    self.selecteditem.urlArray = [];
    Object.keys(this.selecteditem.urls).forEach(function (key) {
      const tmpUrl = self.selecteditem.urls[key];
      tmpUrl['key'] = key;
      self.selecteditem.urlArray.push(tmpUrl);
      console.log(key, tmpUrl);
    });

    this.deleteItem = null;
  }

  selectDeleteItem(article) {
    this.selecteditem = null;
    this.deleteItem = article;
  }

  now() {
    return new Date().getTime();
  }

  since(timestamp) {
    const passed = Math.round((new Date().getTime() + timestamp) / 1000);

    if (passed < 60) {
      return 'minder dan een minuut';
    } else if (passed < 3600) {
      return Math.round(passed / 60) + 1 + ' minuten geleden';
    } else if (passed < 86400) {
      return Math.round(passed / 3600) + 1 + ' uur geleden';
    } else {
      return Math.round(passed / 86400) + 1 + ' dagen geleden';
    }
  }

  createItem() {
    this.articleStream.push({
      title: 'een nieuw artikel',
      content: 'probeer het boeiend te houden!',
      type: 'blog'
    });
  }

  saveItem(selecteditem) {

    const urls = {}
    selecteditem.urlArray.forEach(function (url) {
      urls[url.key] = {
        name: url.name,
        url: url.url
      };
    });
    this.articleStream.update(selecteditem.$key, {
      title: selecteditem.title,
      content: selecteditem.content,
      type: selecteditem.type,
      timestamp: -new Date().getTime(),
      urls: urls
    });
  }

  removeUrl(selecteditem, urlkey) {

    selecteditem.urlArray = selecteditem.urlArray.filter(function( obj ) {
      return obj.key !== urlkey;
    });
    this.saveItem(selecteditem);
  }

  delete(selecteditem) {
    this.articleStream.remove(selecteditem.$key);
    this.selecteditem = null;
    this.deleteItem = null;
  }

  addUrl(selecteditem, name, url) {
    if (url !== '') {

      selecteditem.urlArray.push({
        key: this.makeid(),
        name: name,
        url: url
      });

      console.log(selecteditem.urlArray);
    }
  }

  makeid() {
    let text = '-';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
