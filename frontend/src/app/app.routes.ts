import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Tasks } from './pages/tasks/tasks';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'tasks', component: Tasks, canActivate: ([authGuard]) },
    { path: "", redirectTo: "login", pathMatch: "full" },
];
