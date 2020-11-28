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

  tasklists: TaskList[]; 
  tasks: Task[]; 

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.tasklistId){
          this.taskService.getTasks(params.tasklistId).subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          })
        } else {
          this.tasks = undefined;
        }
      }
      )

      this.taskService.getTaskLists().subscribe((tasklists: TaskList[]) =>{
        this.tasklists = tasklists;
      })
  }

  onTaskClick(task: Task) {
    // Sets task as completed task
    this.taskService.complete(task).subscribe(() =>{
      console.log("Completed successfully");
      task.completed = !task.completed; //to allow user to toggle between 'not completed' and 'completed'
    })

  }

}
