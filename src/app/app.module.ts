/*
 Libraries
 */
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {CKEditorModule} from 'ng2-ckeditor';
import 'hammerjs';
import 'rxjs/add/operator/take';
import {AngularFireModule} from 'angularfire2';

/*
Services
 */
import { WindowRefService } from './services/window-ref.service';




/*
 Components
 */
import {AppComponent} from './components/app/app.component';
import {PodcastsComponent} from './components/podcasts/podcast.component';
import {NewsComponent} from './components/news/news.component';
import {NewsitemComponent} from './components/newsitem/newsitem.component';
import {ProfileComponent} from './components/profile/profile.component';
import {MagazineComponent} from './components/magazine/magazine.component';
import {UsersComponent} from './components/users/users.component';
import {UserComponent} from './components/user/user.component';
import {UrlsComponent} from './components/urls/urls.component';
import {EditorComponent} from './components/editor/editor.component';
import {SubscriptionComponent} from './components/subscription/subscription.component';
import {SnackbarComponent} from './components/snackbar/snackbar.component';
import {LoginComponent} from './components/login/login.component';
import {FeedbackComponent} from './components/feedback/feedback.component';
import {SourcesComponent} from './components/sources/sources.component';

/*
 Configs
 */
import {firebaseConfig} from './configs/firebaseConfig';
import {myFirebaseAuthConfig} from './configs/firebaseAuthConfig';


export const appRoutes: Routes = [
  {path: 'podcasts', component: PodcastsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user/:uid', component: ProfileComponent},
  {path: 'user', component: ProfileComponent},
  {path: 'mijn-artikelen', component: EditorComponent},
  {path: 'abonnement', component: SubscriptionComponent},
  {path: 'news', component: NewsComponent},
  {path: 'news/:title/:id', component: NewsitemComponent},
  {path: '**', component: NewsComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    PodcastsComponent,
    NewsComponent,
    NewsitemComponent,
    ProfileComponent,
    MagazineComponent,
    UrlsComponent,
    UsersComponent,
    UserComponent,
    EditorComponent,
    SubscriptionComponent,
    SnackbarComponent,
    LoginComponent,
    FeedbackComponent,
    SourcesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    CKEditorModule
  ],
  providers: [WindowRefService],
  bootstrap: [AppComponent],
  entryComponents: [
    SnackbarComponent
  ]
})
export class AppModule {

}

