import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {
    email: string;
    password: string;

    constructor(private authService: AuthService) {
    }

    login(provider: string) {
        this.authService.login(provider);
    }

    loginWithPassword(email, password) {
        this.authService.loginWithPassword(this.email, this.password);
    }


}
