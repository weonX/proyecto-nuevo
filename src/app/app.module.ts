import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';


// Importar los módulos de Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // ✅ Módulo para Firestore
import { environment } from '../environments/environment'; // ✅ Importación correcta de environment

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig), // ✅ Inicializar Firebase
    AngularFireAuthModule, // ✅ Módulo de autenticación de Firebase
    AngularFirestoreModule // ✅ Módulo de Firestore
  ],
  providers: [
    SQLite, // ✅ Plugin SQLite para persistencia local
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // ✅ Estrategia de rutas
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Para componentes personalizados de Ionic
})
export class AppModule {}
