export interface Pelicula {
  id: number;
  titulo: string;
  descripcion: string;
  genero: string;
  imagen: string;
  poster_path: string;
  calificacion?: number;  // Add optional calificacion (rating)
  nota?: string;  // Add optional nota (personal note)
}
