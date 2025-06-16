import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common'; // Import NgFor and NgIf
import { Task as TaskService } from '../../services/task';
import { Task } from '../../models/task.model';
import { Notification as NotificationService } from '../../services/notification';
import { TaskFormDialog } from '../../components/task-form-dialog/task-form-dialog';
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-tasks',
  imports: [CommonModule, TaskFormDialog, ConfirmationDialog],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {
  tasks: Task[] = [];
  isLoading = true;
  error: string | null = null;
  showTaskFormDialog = false;
  currentTaskToEdit: Task | null = null;
  showDeleteConfirmationDialog = false;
  taskToDeleteId: string | null = null;
  skeletonItems = Array(5).fill(0); 
  welcomeMessage: string = 'My Tasks';



  constructor(private taskService: TaskService, private notification: NotificationService, private authService: Auth ) { }
  ngOnInit(): void {
    const userName = this.authService.getCurrentUserName();
    this.welcomeMessage = userName ? `Welcome, ${userName}!` : 'My Tasks';
    this.loadTasks();
  }

  onLogout(): void {
    this.authService.logout();
  }

  
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load tasks. Please try again later.';
        console.error('Error loading tasks:', err);
        this.isLoading = false; 
      }
    })
  }

  confirmDeleteTask(): void {
    if (!this.taskToDeleteId) return;

    const taskToDelete = this.tasks.find(t => t._id === this.taskToDeleteId);
    this.taskService.deleteTask(this.taskToDeleteId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t._id !== this.taskToDeleteId);
        this.notification.show(`Task "${taskToDelete?.title || 'Task'}" deleted.`, 'success');
        this.closeDeleteConfirmationDialog();
      },
      error: (err) => {
        this.notification.show(err.error?.message || 'Failed to delete task.', 'error', 3000, 'Error');
        console.error(err);
        this.closeDeleteConfirmationDialog();
      }
    });
  }

  closeDeleteConfirmationDialog(): void {
    this.showDeleteConfirmationDialog = false;
    this.taskToDeleteId = null;
  }

  openAddTaskModal(): void {
    this.currentTaskToEdit = null;
    this.showTaskFormDialog = true;
  }

  openEditTaskModal(task: Task): void {
    this.currentTaskToEdit = task;
    this.showTaskFormDialog = true;
  }

  closeTaskFormModal(taskChanged: boolean = false): void {
    this.showTaskFormDialog = false;
    this.currentTaskToEdit = null;
    if (taskChanged) {
      this.loadTasks();
     }
   }



  handleToggleComplete(task: Task): void {
    this.taskService.updateTask(task._id, { completed: !task.completed } ).subscribe({
      next: (updatedTaskFromServer) => {
        const index = this.tasks.findIndex(t => t._id === updatedTaskFromServer._id);
        if (index !== -1) {
          this.tasks[index] = updatedTaskFromServer;
        }
        this.notification.show(`Task "${updatedTaskFromServer.title}" marked as ${updatedTaskFromServer.completed ? 'complete' : 'pending'}.`, 'success');
      },
      error: (err) => {
        this.notification.show(err.error?.message || 'Failed to update task.', 'error', 3000, 'Error');
        console.error('Error updating task:', err);
      }
    });
  }

  handleDeleteTask(taskId: string): void {
    // const taskToDelete = this.tasks.find(t => t._id === taskId);
    // this.taskService.deleteTask(taskId).subscribe({
    //   next: () => {
    //     this.tasks = this.tasks.filter(t => t._id !== taskId);
    //     this.notification.show(`Task "${taskToDelete?.title || 'Task'}" deleted.`, 'success');
    //   },
    //   error: (err) => {
    //     this.notification.show(err.error?.message || 'Failed to delete task.', 'error', 3000, 'Error');
    //     console.error('Error deleting task:', err);
    //   }
    // });
    this.taskToDeleteId = taskId;
    this.showDeleteConfirmationDialog = true;
  }
}
