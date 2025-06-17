import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbTaskService } from '../services/db-task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  segmentValue = 'mis-datos';
  usuario: string | null = null;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private dbTask: DbTaskService
  ) { }

  async ngOnInit() {
    this.usuario = await this.dbTask.getUsuarioActivo();

    if (!this.usuario) {
      console.warn('No hay usuario activo');
      this.router.navigate(['/login']);
    }
  }

  async logOut() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: async () => {
            if (this.usuario) {
              await this.dbTask.cerrarSesion(this.usuario);
              this.router.navigate(['/login']);
            } else {
              console.warn('No hay usuario activo para cerrar sesión');
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
