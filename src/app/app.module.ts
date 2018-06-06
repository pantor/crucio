import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordSuccessModalComponent } from './change-password/change-password-success-modal/change-password-success-modal.component';
import { RegisterSuccessModalComponent } from './register/register-success-modal/register-success-modal.component';
import { ContactSuccessModalComponent } from './contact/contact-success-modal/contact-success-modal.component';
import { ForgotPasswordSuccessModalComponent } from './forgot-password/forgot-password-success-modal/forgot-password-success-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ContactComponent,
    AboutComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ActivateAccountComponent,
    ChangePasswordComponent,
    ChangePasswordSuccessModalComponent,
    RegisterSuccessModalComponent,
    ContactSuccessModalComponent,
    ForgotPasswordSuccessModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule,
    CookieModule.forRoot(),
    NgbModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [ApiService, AuthService],
  bootstrap: [AppComponent],
  entryComponents: [
    ChangePasswordSuccessModalComponent,
    RegisterSuccessModalComponent,
    ContactSuccessModalComponent,
    ForgotPasswordSuccessModalComponent
  ]
})
export class AppModule { }
