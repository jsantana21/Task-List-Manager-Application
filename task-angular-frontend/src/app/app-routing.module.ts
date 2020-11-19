import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewTaskListComponent } from './pages/new-task-list/new-task-list.component';
import { TaskViewerComponent } from './pages/task-viewer/task-viewer.component';

const routes: Routes = [
  {path: '', component: TaskViewerComponent},
  { path: 'new-task-list', component: NewTaskListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
