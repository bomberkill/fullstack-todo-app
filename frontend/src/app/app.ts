import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification as NotificationComponent } from './components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
}
