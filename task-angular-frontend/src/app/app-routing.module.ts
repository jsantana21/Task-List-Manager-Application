import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewerComponent } from './pages/task-viewer/task-viewer.component';
import { NewTaskListComponent } from './pages/new-task-list/new-task-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';

const routes: Routes = [
  {path: '', redirectTo: 'tasklists', pathMatch: 'full' },
  { path: 'new-task-list', component: NewTaskListComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'tasklists', component: TaskViewerComponent },
  { path: 'tasklists/:tasklistId', component: TaskViewerComponent },
  { path: 'tasklists/:tasklistId/new-task', component: NewTaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
