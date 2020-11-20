import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewerComponent } from './pages/task-viewer/task-viewer.component';

import { HttpClientModule } from '@angular/common/http';
import { NewTaskListComponent } from './pages/new-task-list/new-task-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskViewerComponent,
    NewTaskListComponent,
    NewTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
