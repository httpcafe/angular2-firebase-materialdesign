import {Component, Input, OnInit} from '@angular/core';
import {FirebaseListObservable} from 'angularfire2';
import {FeedbackService} from '../../services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: 'feedback.component.html',
  styleUrls: ['feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  items: FirebaseListObservable<any[]>;


  @Input()
  feedback: string;

  ngOnInit() {
    console.log(this.feedback);
    this.items = this.feedbackService.getFeedback(this.feedback);
  }

  constructor(private feedbackService: FeedbackService) {
  }
}
