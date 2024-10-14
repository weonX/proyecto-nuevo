import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

// Definir una interfaz para las películas
export interface Pelicula {
  id: number;
  titulo: string;
  genero: string;
  descripcion?: string; // Opcional
  imagen?: string; // Opcional
  nota?: string; // Opcional
}

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private apiUrl = 'http://localhost:3000/peliculas'; // URL de la API
  private favoritosKey = 'favoritos'; // Clave para guardar favoritos en el storage

  constructor(private http: HttpClient, private storage: Storage) {}

  // Obtener la lista de películas desde la API
  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl);
  }

  // Agregar una película a favoritos
  async addPeliculaAFavoritos(pelicula: Pelicula): Promise<void> {
    let favoritos: Pelicula[] = await this.storage.get(this.favoritosKey) || [];

    // Recargar la lista actualizada de favoritos antes de verificar
    const existe = favoritos.find(fav => fav.id === pelicula.id);
    
    if (!existe) {
      favoritos.push(pelicula); // Agrega la película si no está en favoritos
      await this.storage.set(this.favoritosKey, favoritos); // Guarda en el almacenamiento
    } else {
      console.log('La película ya está en favoritos');
    }
  }

  // Eliminar una película de favoritos
  async eliminarDeFavoritos(pelicula: Pelicula): Promise<void> {
    let favoritos: Pelicula[] = await this.storage.get(this.favoritosKey) || [];
    favoritos = favoritos.filter(fav => fav.id !== pelicula.id); // Elimina la película
    await this.storage.set(this.favoritosKey, favoritos); // Guarda los cambios en almacenamiento
  }

  // Obtener la lista de favoritos
  async getFavoritos(): Promise<Pelicula[]> {
    return await this.storage.get(this.favoritosKey) || [];
  }
}
