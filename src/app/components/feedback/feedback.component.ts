import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2';
import {FeedbackService} from '../../services/feedback.service';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-feedback',
    templateUrl: 'feedback.component.html',
    styleUrls: ['feedback.component.css'],
    providers: [FeedbackService, AuthService, UserService]
})
export class FeedbackComponent implements OnInit, OnChanges {
    items: FirebaseListObservable<any[]>;
    uid: string;
    newfeedback: string;
    user = {data: {voornaam: ''}};
    editprofile = false;

    @Input()
    feedback: string;

    ngOnInit() {
        // console.log(this.feedback);
        this.items = this.feedbackService.getFeedback(this.feedback);

    }

    ngOnChanges(changes) {
        this.feedback = changes.feedback.currentValue;
        this.items = this.feedbackService.getFeedback(changes.feedback.currentValue);
    }

    constructor(private feedbackService: FeedbackService,
                private authService: AuthService,
                private userService: UserService) {

        this.authService.isAuthenticated().subscribe(authData => {
            if (authData) {
                this.uid = authData.uid;
            }
        });
    }

    addReaction() {

        const user = this.userService.getPublicDataAsObject(this.authService.getAuthid());
        if (user.voornaam && user.familienaam) {
            if (this.newfeedback.length > 0) {
                const newfeedback = {
                    text: this.newfeedback,
                    author: {
                        id: this.authService.getAuthid(),
                        name: user.voornaam + ' ' + user.familienaam
                    },
                    datetime: new Date().getTime()
                };
                // console.log(newfeedback);
                this.feedbackService.addFeedback(this.feedback, newfeedback);
                this.newfeedback = '';
                this.editprofile = false;
            }
        } else {
            this.editprofile = true;
        }
    }
}
