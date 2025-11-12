import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ContactUs } from './contact-us/contact-us';
import { About } from './about/about';
import { Attraction } from './attraction/attraction';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { NotFound } from './not-found/not-found';
import { Symbols } from './symbols/symbols';
import { DetailsPage } from './details-page/details-page';
import { BookNow } from './Booking/book-now/book-now';
import { Details } from './Booking/details/details';
import { Confirmation } from './Booking/confirmation/confirmation';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    {path: '', redirectTo : 'home' , pathMatch: 'full'},
    { path: 'about', component: About },
    { path: 'attractions', component: Attraction },
    { path: 'contact-us', component: ContactUs },
    { path: 'login', component: Login },
    { path: 'sign-up', component: SignUp },
    { path: 'symbols', component: Symbols },
    { path: 'details', component: DetailsPage },
    { path: 'book-now', component: BookNow  , canActivate: [AuthGuard]},
    { path: 'book/details', component: Details },
    { path: 'book/confirmation', component: Confirmation },
    { path: '**', component: NotFound }
];
