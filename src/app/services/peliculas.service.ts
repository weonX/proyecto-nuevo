import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; 
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular'; 
import { map, switchMap } from 'rxjs/operators';
import { Pelicula } from '../services/pelicula.interface'; 

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private db!: SQLiteObject; 
  private apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=8931871dde36da93a3e1eb5cf632c4a2&language=es-ES'; 
  private favoritosKey = 'favoritos'; 

  constructor(
    private http: HttpClient, 
    private sqlite: SQLite, 
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.initDB();
    });
  }

  // ✅ Inicializar la base de datos SQLite
  private async initDB() {
    try {
      this.db = await this.sqlite.create({
        name: 'favoritos.db',
        location: 'default'
      });

      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS favoritos (
          id INTEGER PRIMARY KEY,
          titulo TEXT,
          descripcion TEXT,
          imagen TEXT,
          calificacion INTEGER
        )`, []);
      console.log('Base de datos SQLite inicializada correctamente.');
    } catch (e) {
      console.error('Error al crear la base de datos SQLite', e);
    }
  }

  // ✅ Obtener la lista de películas desde la API de TMDb
  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl);
  }

  // ✅ Obtener las películas populares desde The Movie Database (TMDb)
  getPopularMovies(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // ✅ Obtener favoritos desde SQLite
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

  // ✅ Agregar una película a favoritos en SQLite
  async addPeliculaAFavoritosLocal(pelicula: Pelicula): Promise<void> {
    try {
      const query = 'INSERT INTO favoritos (id, titulo, descripcion, imagen, calificacion) VALUES (?, ?, ?, ?, ?)';
      await this.db.executeSql(query, [pelicula.id, pelicula.titulo, pelicula.descripcion, pelicula.imagen, pelicula.calificacion]);
      console.log('Película agregada a favoritos en SQLite:', pelicula);
    } catch (error) {
      console.error('Error al agregar película a favoritos en SQLite:', error);
    }
  }

  // ✅ Eliminar una película de favoritos en SQLite
  async eliminarDeFavoritosLocal(id: number): Promise<void> {
    try {
      const query = 'DELETE FROM favoritos WHERE id = ?';
      await this.db.executeSql(query, [id]);
      console.log(`Película con id ${id} eliminada de favoritos en SQLite.`);
    } catch (error) {
      console.error('Error al eliminar película de favoritos en SQLite:', error);
    }
  }

  // ✅ Sincronizar con la API REST
  syncFavoritos(): Observable<any> {
    return this.getFavoritosLocal().pipe(
      switchMap(favoritosLocal => {
        return this.http.post(`${this.apiUrl}/sync`, { favoritos: favoritosLocal });
      })
    );
  }

  // ✅ Obtener favoritos desde la API REST
  getFavoritosFromAPI(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}/favoritos`).pipe(
      switchMap((favoritosAPI: Pelicula[]) => {
        return from(this.syncLocalWithAPI(favoritosAPI)).pipe(
          map(() => favoritosAPI) 
        );
      })
    );
  }

  // ✅ Sincronizar SQLite con los favoritos de la API
  private async syncLocalWithAPI(favoritosAPI: Pelicula[]) {
    await this.db.executeSql('DELETE FROM favoritos', []);
    for (let favorito of favoritosAPI) {
      await this.addPeliculaAFavoritosLocal(favorito);
    }
    console.log('Sincronización local con la API completada.');
  }
}
