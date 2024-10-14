import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; // Importar SQLite
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular'; // Para verificar la plataforma
import { map, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { Pelicula } from './pelicula.interface'; // Interfaz definida

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private db!: SQLiteObject; // Ajustar el uso de `!` para evitar errores de inicialización
  private apiUrl = 'http://localhost:3000/peliculas'; // URL de la API
  private favoritosKey = 'favoritos'; // Clave para guardar favoritos en el storage

  constructor(
    private http: HttpClient, 
    private sqlite: SQLite, 
    private platform: Platform,
    private storage: Storage
  ) {
    // Inicializar SQLite cuando la plataforma esté lista
    this.platform.ready().then(() => {
      this.initDB();
    });
  }

  // Inicializar la base de datos SQLite
  private async initDB() {
    try {
      this.db = await this.sqlite.create({
        name: 'favoritos.db',
        location: 'default'
      });
      // Crear tabla si no existe
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS favoritos (
          id INTEGER PRIMARY KEY,
          titulo TEXT,
          genero TEXT,
          descripcion TEXT,
          imagen TEXT
        )`, []);
    } catch (e) {
      console.error('Error al crear la base de datos SQLite', e);
    }
  }

  // Obtener la lista de películas desde la API
  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl);
  }

  // Obtener favoritos desde SQLite
  getFavoritosLocal(): Observable<Pelicula[]> {
    const query = 'SELECT * FROM favoritos';
    return from(this.db.executeSql(query, [])).pipe(
      map(res => {
        let favoritos: Pelicula[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          favoritos.push(res.rows.item(i));
        }
        return favoritos;
      })
    );
  }

  // Agregar una película a favoritos en SQLite
  async addPeliculaAFavoritosLocal(pelicula: Pelicula): Promise<void> {
    const query = 'INSERT INTO favoritos (id, titulo, genero, descripcion, imagen) VALUES (?, ?, ?, ?, ?)';
    await this.db.executeSql(query, [pelicula.id, pelicula.titulo, pelicula.genero, pelicula.descripcion, pelicula.imagen]);
  }

  // Eliminar una película de favoritos en SQLite
  async eliminarDeFavoritosLocal(id: number): Promise<void> {
    const query = 'DELETE FROM favoritos WHERE id = ?';
    await this.db.executeSql(query, [id]);
  }

  // Sincronizar con la API REST
  syncFavoritos() {
    return this.getFavoritosLocal().pipe(
      switchMap(favoritosLocal => {
        // Enviar los favoritos locales a la API REST para sincronizar
        return this.http.post(`${this.apiUrl}/sync`, { favoritos: favoritosLocal });
      })
    );
  }

  // Obtener favoritos desde la API REST
  getFavoritosFromAPI(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}/favoritos`).pipe(
      switchMap((favoritosAPI: Pelicula[]) => {
        // Sincronizar la base de datos local con los favoritos de la API
        return from(this.syncLocalWithAPI(favoritosAPI)).pipe(
          map(() => favoritosAPI) // Devuelve los favoritos de la API después de la sincronización
        );
      })
    );
  }

  // Sincronizar SQLite con los favoritos de la API
  private async syncLocalWithAPI(favoritosAPI: Pelicula[]) {
    // Limpiar la base de datos local
    await this.db.executeSql('DELETE FROM favoritos', []);
    // Insertar los favoritos de la API en SQLite
    for (let favorito of favoritosAPI) {
      await this.addPeliculaAFavoritosLocal(favorito);
    }
  }
}
