import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupComponent } from './dashboard/group/group.component';
import { ChannelComponent } from './dashboard/channel/channel.component';

@NgModule({
  declarations: [
    AppComponent,
    ChannelComponent,
  ],
  imports: [
    BrowserModule,
    AuthenticationComponent,
    AppRoutingModule,
    LoginComponent,
    DashboardComponent,
    GroupComponent,
    AuthenticationComponent,
    RegisterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
