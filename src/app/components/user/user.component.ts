import {Component, Input, OnInit} from '@angular/core';
import {FirebaseObjectObservable} from 'angularfire2';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})
export class UserComponent implements OnInit {
  publicUserdataStream: FirebaseObjectObservable<any[]>;

  @Input()
  uid: string;


  ngOnInit() {
    this.publicUserdataStream = this.userService.getPublicUserdata(this.uid);
  }

  constructor(private userService: UserService) {
  }
}
