import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupComponent } from './dashboard/group/group.component';
import { ChannelComponent } from './dashboard/channel/channel.component';
import { ChatComponent } from './dashboard/channel/chat/chat.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { UploadWidgetModule } from "@bytescale/upload-widget-angular";
import { UserDetailsComponent } from './dashboard/user-details/user-details.component';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AuthenticationComponent,
    AppRoutingModule,
    LoginComponent,
    DashboardComponent,
    GroupComponent,
    AuthenticationComponent,
    ChatComponent,
    RegisterComponent,
    ChannelComponent,
    PickerComponent,
    UploadWidgetModule, 
    UserDetailsComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
