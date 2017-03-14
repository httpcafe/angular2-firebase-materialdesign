import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';

import {AngularFireModule} from 'angularfire2';

import {AppComponent} from './components/app/app.component';
import {PodcastsComponent} from './components/podcasts/podcast.component';
import {NewsComponent} from './components/news/news.component';
import {ProfileComponent} from './components/profile/profile.component';

import {firebaseConfig} from './configs/firebaseConfig';
import {myFirebaseAuthConfig} from './configs/firebaseAuthConfig';



export const appRoutes: Routes = [
    {path: 'podcasts', component: PodcastsComponent},
    {path: 'user', component: ProfileComponent},
    {path: '**', component: NewsComponent}
];




@NgModule({
    declarations: [
        AppComponent,
        PodcastsComponent,
        NewsComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
        MaterialModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

}
