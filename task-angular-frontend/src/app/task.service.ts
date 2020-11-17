import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private WebRequestService: WebRequestService) { }

  createTaskList(title: string) {
    // Sends web request to create a task list
    return this.WebRequestService.post('tasklists', { title });
  }

}
