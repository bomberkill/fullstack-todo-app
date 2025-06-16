import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationMessage {
  title?: string;
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Notification {
  private notificationSubject = new BehaviorSubject<NotificationMessage | null>(null);
  public notification$: Observable<NotificationMessage | null> = this.notificationSubject.asObservable();

  private timer: any;

  constructor() { }
  show(message: string, type: 'success' | 'error' = 'success', duration: number = 5000, title?: string) {
    this.notificationSubject.next({title, message, type, visible: true });

    
    if (this.timer) {
      clearTimeout(this.timer);
    }

    
    this.timer = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    const currentNotification = this.notificationSubject.value;
    if (currentNotification) {
      this.notificationSubject.next({ ...currentNotification, visible: false });
    }
  }

}
