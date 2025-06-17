import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DbTaskService } from '../services/db-task.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private dbTask: DbTaskService, private router: Router) { }

    async canActivate(): Promise<boolean> {
        const usuarioActivo = await this.dbTask.getUsuarioActivo();
        if (usuarioActivo) {
            return true; 
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
