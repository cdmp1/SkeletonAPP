import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Capacitor } from '@capacitor/core';
import {
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';


@Injectable({
  providedIn: 'root'
})
export class DbTaskService {

  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'skeletonapp.db';

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.sqlite = new SQLiteConnection(Capacitor);
    this.initStorage();
  }

  async initStorage() {
    this._storage = await this.storage.create();
  }

  async initDB(): Promise<void> {
    try {
      this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
      await this.db.open();
      await this.createTables();
    } catch (err) {
      console.error('Error initDB:', err);
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;
    const createSesionTable = `
      CREATE TABLE IF NOT EXISTS sesion_data (
        user_name TEXT PRIMARY KEY NOT NULL,
        password INTEGER NOT NULL,
        active INTEGER NOT NULL
      );
    `;
    try {
      await this.db.execute(createSesionTable);
    } catch (err) {
      console.error('Error creando tabla:', err);
    }
  }


  async insertarUsuario(user_name: string, password: number): Promise<void> {
    if (!this.db) return;
    try {
      await this.db.run(
        'INSERT INTO sesion_data (user_name, password, active) VALUES (?, ?, 0);',
        [user_name, password]
      );
    } catch (err) {
      console.error('Error insertando usuario:', err);
    }
  }


  async existeSesionActiva(): Promise<boolean> {
    if (!this.db) return false;
    try {
      const res = await this.db.query('SELECT * FROM sesion_data WHERE active = 1 LIMIT 1;');
      return (res.values?.length ?? 0) > 0;
    } catch (err) {
      console.error('Error consulta sesión activa:', err);
      return false;
    }
  }


  async getUsuarioActivo(): Promise<string | null> {
    return await this._storage?.get('usuarioActivo') ?? null;
  }


  async setUsuarioActivo(user_name: string): Promise<void> {
    await this._storage?.set('usuarioActivo', user_name);
  }


  async removeUsuarioActivo(): Promise<void> {
    await this._storage?.remove('usuarioActivo');
  }


  async validarUsuario(user_name: string, password: number): Promise<boolean> {
    if (!this.db) return false;
    try {
      const res = await this.db.query(
        'SELECT * FROM sesion_data WHERE user_name = ? AND password = ?;',
        [user_name, password]
      );
      return (res.values?.length ?? 0) > 0;
    } catch (err) {
      console.error('Error validando usuario:', err);
      return false;
    }
  }


  async registrarSesion(user_name: string, password: number): Promise<void> {
    if (!this.db) return;
    try {
      const exists = await this.validarUsuario(user_name, password);
      if (exists) {
        await this.db.run('UPDATE sesion_data SET active = 1 WHERE user_name = ?;', [user_name]);
      } else {
        await this.db.run(
          'INSERT INTO sesion_data (user_name, password, active) VALUES (?, ?, 1);',
          [user_name, password]
        );
      }
      await this.setUsuarioActivo(user_name);
    } catch (err) {
      console.error('Error registrando sesión:', err);
    }
  }


  async cerrarSesion(user_name: string): Promise<void> {
    if (!this.db) return;
    try {
      await this.db.run('UPDATE sesion_data SET active = 0 WHERE user_name = ?;', [user_name]);
      await this.removeUsuarioActivo();
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
  }


  async closeConnection(): Promise<void> {
    if (!this.db) return;
    await this.sqlite.closeConnection(this.dbName, false);
    this.db = null;
  }
}
