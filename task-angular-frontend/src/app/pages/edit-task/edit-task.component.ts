import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  taskId: string;
  tasklistId: string;

  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params.taskId;
        this.tasklistId = params.tasklistId;
      }
    )
  }

  clickUpdateTask(title: string) {
    this.taskService.updateTask(this.tasklistId, this.taskId, title).subscribe(() => {
      this.router.navigate(['/tasklists', this.tasklistId]);
    })
  }

}
