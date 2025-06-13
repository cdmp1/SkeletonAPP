import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: false
})
export class MisDatosComponent {
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  direccion: string = '';
  comuna: string = '';
  region: string = '';
  genero: string = '';
  nivelEducacion: string = '';
  fechaNacimiento: Date | null = null;

  modoEdicion: boolean = false;


  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) { }


  async guardarDatos() {
    console.log('Datos guardados:', {
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      direccion: this.direccion,
      comuna: this.comuna,
      region: this.region,
      genero: this.genero,
      nivelEducacion: this.nivelEducacion,
      fechaNacimiento: this.fechaNacimiento,
    });

    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: 'Tus datos han sido guardados correctamente.',
      buttons: ['OK']
    });

    await alert.present();
  }


  limpiarCampos() {
    this.nombre = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.direccion = '';
    this.comuna = '';
    this.region = '';
    this.genero = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = null;
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
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}
