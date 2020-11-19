import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task-list',
  templateUrl: './new-task-list.component.html',
  styleUrls: ['./new-task-list.component.scss']
})
export class NewTaskListComponent implements OnInit {

  tasklist: any; //model for tasklist will be created later on..

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }

  createNewTaskList(title: string) {
    this.taskService.createTaskList(title).subscribe((response: any ) => {
      console.log(response);
      // Navigates to /task-lists/response._id
    });
  }

}
