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
          const favoritoIdStr = String(favorito.id);
          this.firestore.collection('users').doc(userId).collection('favoritos').doc(favoritoIdStr).set(favorito).then(
            () => observer.next(),
            error => observer.error(error)
          );
        } else {
          observer.error('Usuario no autenticado.');
        }
      });
    });
  }

  // ✅ Eliminar un favorito (Firebase y SQLite)
  deleteFavorito(favoritoId: any): Observable<void> {
    return new Observable(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid;
          const favoritoIdStr = String(favoritoId); 
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

  // ✅ Calificar un favorito (Firebase y SQLite)
  updateFavorito(favoritoId: string, data: any): Observable<void> {
    return new Observable(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid;
          const favoritoIdStr = String(favoritoId); 
          this.firestore.collection('users').doc(userId).collection('favoritos').doc(favoritoIdStr).update(data).then(
            () => {
              console.log(`Calificación de la película con ID ${favoritoIdStr} actualizada.`);
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
}
