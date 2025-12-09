import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Home } from './home/home';
import { About } from './about/about';
import { Attraction } from './attraction/attraction';
import { ContactUs } from './contact-us/contact-us';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { NotFound } from './not-found/not-found';
import { Symbols } from './symbols/symbols';
import { Nav } from './nav/nav';
import { ProfileComponent } from './profile/profile';
import { Forgetpassword } from './forgetpassword/forgetpassword';
import { Resendemail } from './resendemail/resendemail';
import { ResetPassword } from './reset-password/reset-password';
import { ResetSuccess } from './reset-success/reset-success';
import { TermsOfServices } from './terms-of-services/terms-of-services';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { Hero } from './home/hero/hero';
import { BookNow } from './Booking/book-now/book-now';
import { Confirmation } from './Booking/confirmation/confirmation';
import { Details } from './Booking/details/details';
import { Stepper } from './Booking/stepper/stepper';
import { Instructions } from './instructions/instructions';
// import { AdminLayout } from './admin/admin-layout/admin-layout';
// import { StatCard } from './admin/stat-card/stat-card';
// import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
// import { AdminBooking } from './admin/admin-booking/admin-booking';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer, Home, Hero, About, Attraction, ContactUs, Login, SignUp, NotFound, Symbols, ProfileComponent,
    Forgetpassword, Resendemail, ResetPassword, ResetSuccess, TermsOfServices, PrivacyPolicy, BookNow, Confirmation, Details,
    Stepper , Instructions/*, AdminLayout,StatCard, AdminDashboard , AdminBooking*/],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Go-Egypt');
}
