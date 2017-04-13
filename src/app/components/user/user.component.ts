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
  imageOnly: boolean;

  @Input()
  uid: string;
  @Input()
  imageonly: string;


  ngOnInit() {
    if (this.imageonly) {
      this.imageOnly = true;
    } else {
      this.imageOnly = false;
    }
    //console.log(this.imageonly, this.imageOnly, this.uid);
    this.publicUserdataStream = this.userService.getPublicUserdata(this.uid);
  }

  constructor(private userService: UserService) {
  }
}
