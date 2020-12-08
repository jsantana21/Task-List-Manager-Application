import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { TaskList } from 'src/app/models/task-list.model';

@Component({
  selector: 'app-new-task-list',
  templateUrl: './new-task-list.component.html',
  styleUrls: ['./new-task-list.component.scss']
})
export class NewTaskListComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
  }

  createNewTaskList(title: string) {
    this.taskService.createTaskList(title).subscribe((tasklist: TaskList ) => {
      console.log(tasklist);
      // Navigates to /tasklists/tasklist._id
      this.router.navigate(['/tasklists', tasklist._id]);
    });
  }



}
