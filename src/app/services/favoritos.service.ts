import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  // ✅ Obtener la lista de favoritos del usuario autenticado
  getFavoritos(): Observable<any[]> {
    return new Observable(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid;
          this.firestore.collection('users').doc(userId).collection('favoritos').snapshotChanges().subscribe(
            res => {
              const favoritos = res.map(doc => ({
                id: doc.payload.doc.id,
                ...doc.payload.doc.data()
              }));
              observer.next(favoritos);
            },
            error => observer.error(error)
          );
        } else {
          observer.error('Usuario no autenticado.');
        }
      });
    });
  }

  // ✅ Agregar un favorito
  addFavorito(favorito: any): Observable<void> {
    return new Observable(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid;
          const favoritoIdStr = String(favorito.id); // Convertimos el ID a string
          this.firestore.collection('users').doc(userId).collection('favoritos').doc(favoritoIdStr).set({
            ...favorito,
            calificacion: favorito.calificacion || 0 // Se agrega calificación inicial en 0 si no está definida
          }).then(
            () => observer.next(),
            error => observer.error(error)
          );
        } else {
          observer.error('Usuario no autenticado.');
        }
      });
    });
  }

  // ✅ Eliminar un favorito de Firebase
  deleteFavorito(favoritoId: string | number): Observable<void> {
    return new Observable(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid;
          const favoritoIdStr = String(favoritoId); // Convertimos el ID a string
          this.firestore.collection('users').doc(userId).collection('favoritos').doc(favoritoIdStr).delete().then(
            () => {
              console.log(`Favorito con ID ${favoritoIdStr} eliminado de Firebase.`);
              observer.next();
            },
            error => observer.error(error)
          );
        } else {
          observer.error('Usuario no autenticado.');
        }
      });
    });
  }

  // ✅ Actualizar un favorito (para la calificación)
  updateFavorito(favoritoId: string | number, data: any): Observable<void> {
    return new Observable(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid;
          const favoritoIdStr = String(favoritoId); // Convertimos el ID a string
          this.firestore.collection('users').doc(userId).collection('favoritos').doc(favoritoIdStr).update(data).then(
            () => observer.next(),
            error => observer.error(error)
          );
        } else {
          observer.error('Usuario no autenticado.');
        }
      });
    });
  }
}
