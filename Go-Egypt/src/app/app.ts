import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Home } from './home/home';
import { About } from './about/about';
import { Attraction } from './attraction/attraction';
import { ContactUs } from './contact-us/contact-us';
import { Login } from './login/login';
import { SignUp } from './sign-up/sign-up';
import { NotFound } from './not-found/not-found';
import { Symbols } from './symbols/symbols';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer,Home,About,Attraction,ContactUs,Login,SignUp,NotFound,Symbols],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Go-Egypt');
}
