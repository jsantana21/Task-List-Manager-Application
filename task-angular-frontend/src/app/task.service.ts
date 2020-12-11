import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private WebRequestService: WebRequestService) { }

  getTaskLists() {
    return this.WebRequestService.get('tasklists');
  }

  createTaskList(title: string) {
    // Sends web request to create a task list
    return this.WebRequestService.post('tasklists', { title });
  }

  deleteTaskList(id: string) {
    return this.WebRequestService.delete(`tasklists/${id}`);
  }

  getTasks(tasklistId: string) {
    return this.WebRequestService.get(`tasklists/${ tasklistId }/tasks`);
  }

  createNewTask(title: string, tasklistId: string) {
    // Sends web request to create a task 
    return this.WebRequestService.post(`tasklists/${tasklistId}/tasks`, { title });
  }

  complete(task: Task) {
    return this.WebRequestService.patch(`tasklists/${task._tasklistId}/tasks/${task._id}`, {
      completed: !task.completed
    });

  }



}
