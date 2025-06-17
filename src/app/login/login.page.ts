import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { DbTaskService } from '../services/db-task.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private dbTask: DbTaskService
  ) {}

  async ngOnInit() {
    await this.dbTask.initDB();
  }

  async login() {
    const usuarioValido = /^[a-zA-Z0-9]{3,8}$/.test(this.usuario);
    const passwordValido = /^[0-9]{4}$/.test(this.password);

    if (!usuarioValido) {
      this.showAlert('Error', 'El nombre de usuario debe tener entre 3 y 8 caracteres alfanuméricos.');
      return;
    }

    if (!passwordValido) {
      this.showAlert('Error', 'La contraseña debe ser un número de 4 dígitos.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Validando usuario...'
    });
    await loading.present();

    const passwordNum = parseInt(this.password, 10);
    const usuarioExiste = await this.dbTask.validarUsuario(this.usuario, passwordNum);

    if (usuarioExiste) {
      await this.dbTask.registrarSesion(this.usuario, passwordNum);
      await loading.dismiss();
      this.router.navigate(['/home'], {
        state: { usuario: this.usuario }
      });
    } else {
      await loading.dismiss();
      this.showAlert('Error', 'Usuario o contraseña incorrectos.');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
