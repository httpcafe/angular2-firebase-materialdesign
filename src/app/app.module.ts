import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';

import {AngularFireModule} from 'angularfire2';

import {AppComponent} from './app.component';
import {PodcastComponent} from './podcast.component';
import {NewsComponent} from './news.component';

import {firebaseConfig} from './configs/firebaseConfig';
import {myFirebaseAuthConfig} from './configs/firebaseAuthConfig';



export const appRoutes: Routes = [
    {path: 'podcasts', component: PodcastComponent},
    {path: '**', component: NewsComponent}
];




@NgModule({
    declarations: [
        AppComponent,
        PodcastComponent,
        NewsComponent
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
