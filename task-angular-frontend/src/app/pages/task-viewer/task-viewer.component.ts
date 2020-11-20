import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.scss']
})
export class TaskViewerComponent implements OnInit {

  tasklists: any[]; //model for tasklists will be created later on...
  tasks: any[]; //model for tasks will be created later on...

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params);
        this.taskService.getTasks(params.tasklistId).subscribe((tasks: any[]) => {
          this.tasks = tasks;
        })

      }
      )

      this.taskService.getTaskLists().subscribe((tasklists: any[]) =>{
        this.tasklists = tasklists;
      })
  }

}
