import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() {
    createTaskList(title: string) {
      // Sends web request to create a task list
      return this.webReqService.post('lists', { title });
    }
   }
}
