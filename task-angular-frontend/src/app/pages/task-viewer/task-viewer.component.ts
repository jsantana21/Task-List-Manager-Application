import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.scss']
})
export class TaskViewerComponent implements OnInit {

  constructor(private TaskService: TaskService) { }

  ngOnInit(): void {
  }

  createNewTaskList(){
    this.TaskService.createTaskList("Testing").subscribe((response: any) =>{
      console.log(response);
    });
  }

}
