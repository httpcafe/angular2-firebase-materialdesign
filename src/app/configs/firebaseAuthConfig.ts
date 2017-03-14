import {AuthProviders, AuthMethods} from 'angularfire2';

export const myFirebaseAuthConfig = {
    provider: AuthProviders.Google,
    method: AuthMethods.Redirect
};