import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
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

  selectedTaskListId: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.tasklistId){
          this.selectedTaskListId = params.tasklistId;
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

  clickDeleteTaskList() {
    this.taskService.deleteTaskList(this.selectedTaskListId).subscribe((res: any) => {
      this.router.navigate(['/tasklists']);
      console.log(res);
    })
  }

  clickDeleteTask(id: string) {
    this.taskService.deleteTask(this.selectedTaskListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id); //filter out task from task array
      console.log(res);
    })
  }

  clickLogOut() {
    this.authService.logout();
  }

}
