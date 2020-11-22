import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskList } from 'src/app/models/task-list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.scss']
})
export class TaskViewerComponent implements OnInit {

  tasklists: TaskList[]; //model for tasklists will be created later on...
  tasks: Task[]; //model for tasks will be created later on...

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskService.getTasks(params.tasklistId).subscribe((tasks: Task[]) => {
          this.tasks = tasks;
        })

      }
      )

      this.taskService.getTaskLists().subscribe((tasklists: TaskList[]) =>{
        this.tasklists = tasklists;
      })
  }

  completedTaskClick(task: Task) {
    // Sets task as completed task
    this.taskService.completed(task).subscribe(() =>{
      console.log("Completed successfully");
    })

  }

}
