import {Component} from '@angular/core';
import {FirebaseAuthState, AngularFire} from 'angularfire2';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    validemail = false;
    af;
    parentRouter;
    error: string;


    constructor(af: AngularFire,
                private userService: UserService,
                router: Router) {
        this.af = af;
        this.parentRouter = router;
    }

    checkEmail() {
        const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (this.email !== undefined && (this.email.length <= 5 || !EMAIL_REGEXP.test(this.email))) {
            this.validemail = false;
        } else {
            this.validemail = true;
        }

        return this.validemail;
    }

    register(): Promise<FirebaseAuthState> {
        return this.af.auth.createUser({
            email: this.email,
            password: this.password
        })
            .then((authState: FirebaseAuthState) => {

                const self = this;
                self.userService.updatePublicUserdata(self.userService.getPublicUserdata(authState.uid), 'voornaam', self.firstname);
                self.userService.updatePublicUserdata(self.userService.getPublicUserdata(authState.uid), 'familienaam', self.lastname);
                self.userService.updateEmail(self.userService.getPrivateUserdata(authState.uid), self.email);


                self.parentRouter.navigate(['/user/']);
            })
            .catch((error) => {
                console.error(error);
                this.error = error.message;
                throw error;
            });

    }
}