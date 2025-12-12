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
import { PaymentComponent } from './Booking/payment/payment';
import { AuthGuard } from './guards/auth-guard';
import { LoginGuard } from './guards/login-guard';
import { Forgetpassword } from './forgetpassword/forgetpassword';
import { Resendemail } from './resendemail/resendemail';
import { ProfileComponent } from './profile/profile';
import { ResetPassword } from './reset-password/reset-password';
import { ResetSuccess } from './reset-success/reset-success';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { TermsOfServices } from './terms-of-services/terms-of-services';
import { Instructions } from './instructions/instructions';
import { MyBookings } from './my-bookings/my-bookings';
// import { AdminLayout } from './admin/admin-layout/admin-layout';
// import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
// import { AdminBooking } from './admin/admin-booking/admin-booking';



export const routes: Routes = [
    { path: '', component: Home },
    { path: '', redirectTo : 'home' , pathMatch: 'full'},
    { path: 'about', component: About },
    { path: 'attractions', component: Attraction },
    { path: 'contact-us', component: ContactUs },
    { path: 'login', component: Login, canActivate: [LoginGuard]},
    { path: 'sign-up', component: SignUp, canActivate: [LoginGuard]},
    { path: 'symbols', component: Symbols },
    { path: 'attractions/:id', component: DetailsPage },
    { path: 'book-now', component: BookNow  , canActivate: [AuthGuard]},
    { path: 'book/details', component: Details },
    { path: 'book/payment', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'book/confirmation', component: Confirmation },
    { path: 'forgetpassword', component: Forgetpassword , canActivate: [LoginGuard]},
    { path: 'resendemail', component: Resendemail , canActivate: [LoginGuard]},
    { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard]},
    { path: 'reset-password', component: ResetPassword , canActivate: [LoginGuard]},
    { path: 'reset-success', component: ResetSuccess , canActivate: [LoginGuard]},
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: 'terms-of-services', component: TermsOfServices },
    { path: 'instructions', component: Instructions },
    {path: 'my-bookings', component: MyBookings, canActivate: [AuthGuard]},
    // { path: 'admin-layout', component: AdminLayout },
    // { path: 'admin/dashboard', component: AdminDashboard },
    // { path: 'admin/bookings', component: AdminBooking },
    { path: '**', component: NotFound }
];

