import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewerComponent } from './pages/task-viewer/task-viewer.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewTaskListComponent } from './pages/new-task-list/new-task-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WebRequestInterceptor } from './web-request.interceptor';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskViewerComponent,
    NewTaskListComponent,
    NewTaskComponent,
    LoginPageComponent,
    SignupPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: WebRequestInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
