import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

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
    this.taskService.createTaskList(title).subscribe((response: any ) => {
      console.log(response);
      // Navigates to /task-lists/response._id
      this.router.navigate(['/task-lists', response._id]);
    });
  }



}
