import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  standalone: false
})
export class CertificacionesComponent implements OnInit {
  cert: {
    nombre: string;
    fechaObtencion: string;
    vencimiento: boolean;
    fechaVencimiento: string;
  } = {
    nombre: '',
    fechaObtencion: '',
    vencimiento: false,
    fechaVencimiento: ''
  };

  certificados: {
    nombre: string;
    fechaObtencion: string;
    vencimiento: boolean;
    fechaVencimiento: string;
  }[] = [];

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('certificados');
    if (data) this.certificados = JSON.parse(data);
  }

  guardar() {
    this.certificados.push({ ...this.cert });
    localStorage.setItem('certificados', JSON.stringify(this.certificados));
    this.cert = {
      nombre: '',
      fechaObtencion: '',
      vencimiento: false,
      fechaVencimiento: ''
    };
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
