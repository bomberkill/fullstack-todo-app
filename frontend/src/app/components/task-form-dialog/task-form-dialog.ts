import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task as TaskService } from '../../services/task';
import { Notification as NotificationService } from '../../services/notification';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './task-form-dialog.html',
  styleUrl: './task-form-dialog.css'
})
export class TaskFormDialog {
  @Output() closeDialog = new EventEmitter<boolean>();
  @Input() taskToEdit: Task | null = null;

  taskForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private taskService: TaskService, private notification: NotificationService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.taskToEdit) {
      this.taskForm.patchValue({
        _id: this.taskToEdit._id,
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
      });
    }
  }


  get title() { return this.taskForm.get('title'); }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      const message = this.taskToEdit ? 'Please correct the errors.' : 'Please provide a valid task title.';
      this.notification.show(message, 'error', 3000, 'Validation Error');
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { title, description} = this.taskForm.value;
    const taskData = {title, description};

    if (this.taskToEdit) {
      // console.log("edit data for task ID:", this.taskToEdit._id, "Data:", taskData); 
      this.taskService.updateTask(this.taskToEdit._id, taskData).subscribe({
        next: () => {
          this.notification.show('Task updated successfully!', 'success', 5000, 'Success');
          this.isSubmitting = false;
          this.closeDialog.emit(true);
        },
        error: (err) => {
          this.notification.show(err.error?.message || 'Failed to update task.', 'error', 5000, 'Error');
          this.isSubmitting = false;
          console.error(err);
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.notification.show('Task created successfully!', 'success', 5000, 'Success');
          this.isSubmitting = false;
          this.taskForm.reset(); 
          this.closeDialog.emit(true);
        },
        error: (err) => {
          this.notification.show(err.error?.message || 'Failed to create task.', 'error', 5000, 'Error');
          this.isSubmitting = false;
          console.error(err);
        }
      });
    }

  }

  onCancel(): void {
    this.closeDialog.emit(false);
  }
}
