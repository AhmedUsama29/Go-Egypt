import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ContactUs } from './contact-us/contact-us';
import { About } from './about/about';
import { Attraction } from './attraction/attraction';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { NotFound } from './not-found/not-found';
import { Symbols } from './symbols/symbols';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'attraction', component: Attraction },
    { path: 'contact-us', component: ContactUs },
    { path: 'login', component: Login },
    { path: 'sign-up', component: SignUp },
    { path: 'symbols', component: Symbols },
    { path: '**', component: NotFound }
];
