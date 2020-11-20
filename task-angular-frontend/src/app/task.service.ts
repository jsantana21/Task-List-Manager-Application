import { Injectable } from '@angular/core';
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

  getTasks(tasklistId: string) {
    return this.WebRequestService.get(`tasklists/${ tasklistId }/tasks`);
  }

  createNewTask(title: string, tasklistId: string) {
    // Sends web request to create a task 
    return this.WebRequestService.post(`tasklists/${tasklistId}/tasks`, { title });
  }



}
