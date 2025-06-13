import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
  standalone: false
})
export class ExperienciaLaboralComponent implements OnInit {
  experiencia: {
    empresa: string;
    anioInicio: number | null;
    actual: boolean;
    anioTermino: number | null;
    cargo: string;
  } = {
    empresa: '',
    anioInicio: null,
    actual: false,
    anioTermino: null,
    cargo: ''
  };

  experiencias: Array<{
    empresa: string;
    anioInicio: number | null;
    actual: boolean;
    anioTermino: number | null;
    cargo: string;
  }> = [];

  anios: number[] = [];

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('experiencias');
    if (data) this.experiencias = JSON.parse(data);

    const currentYear = new Date().getFullYear();
    for (let year = 1950; year <= currentYear + 5; year++) {
      this.anios.push(year);
    }
  }

  guardar() {
    if (!this.experiencia.actual && !this.experiencia.anioTermino) return;

    this.experiencias.push({ ...this.experiencia });
    localStorage.setItem('experiencias', JSON.stringify(this.experiencias));

    this.experiencia = {
      empresa: '',
      anioInicio: null,
      actual: false,
      anioTermino: null,
      cargo: ''
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
