import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DbTaskService } from '../services/db-task.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private dbTask: DbTaskService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  async registrar(): Promise<void> {
    if (this.registerForm.valid) {
      this.cargando = true;

      const { usuario, password } = this.registerForm.value;
      const passwordNum = parseInt(password, 10);

      const existe = await this.dbTask.validarUsuario(usuario, passwordNum);
      if (existe) {
        this.cargando = false;
        const toast = await this.toastController.create({
          message: 'El usuario ya existe.',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
        return;
      }

      try {
        // Insertar usuario sin activar la sesión
        await this.dbTask.insertarUsuario(usuario, passwordNum);

        const toast = await this.toastController.create({
          message: '¡Usuario creado exitosamente!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });

        await toast.present();
        toast.onDidDismiss().then(() => {
          this.router.navigate(['/login']);
        });

      } catch (error) {
        console.error('Error registrando:', error);
        this.cargando = false;

        const toast = await this.toastController.create({
          message: 'Error al registrar usuario.',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });

        await toast.present();
      }

    } else {
      console.log('Formulario inválido');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
