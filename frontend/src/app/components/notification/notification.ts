import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationMessage, Notification as NotificationService } from '../../services/notification';
import { Subscription } from 'rxjs';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [NgIf, NgClass],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification implements OnInit, OnDestroy {
  notification: NotificationMessage | null = null;
  private notificationSubscription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.notification$.subscribe(
      (notification) => {
        this.notification = notification;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  closeNotification(): void {
    this.notificationService.hide();
  }

}
