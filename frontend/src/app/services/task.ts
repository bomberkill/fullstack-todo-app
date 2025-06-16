import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task as TaskMessage } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class Task {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) { }
  createTask(task: Partial<TaskMessage>): Observable<TaskMessage> {
    return this.http.post<TaskMessage>(this.apiUrl, task);
  }
  updateTask(taskId: string, taskData: Partial<TaskMessage>): Observable<TaskMessage> {
    return this.http.put<TaskMessage>(`${this.apiUrl}/${taskId}`, taskData);
  }
  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
  getTasks(): Observable<TaskMessage[]> {
    return this.http.get<TaskMessage[]>(this.apiUrl);
  }
}
