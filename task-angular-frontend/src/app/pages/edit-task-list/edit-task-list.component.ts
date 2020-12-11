import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task-list',
  templateUrl: './edit-task-list.component.html',
  styleUrls: ['./edit-task-list.component.scss']
})
export class EditTaskListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  tasklistId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.tasklistId = params.tasklistId;
        console.log(params.tasklistId);
      }
    )
  }

  updateTaskList(title: string) {
    this.taskService.updateTaskList(this.tasklistId, title).subscribe(() => {
      this.router.navigate(['/tasklists', this.tasklistId]);
    })
  }

}
