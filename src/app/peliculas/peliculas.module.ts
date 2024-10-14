import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PeliculasPageRoutingModule } from './peliculas-routing.module';
import { PeliculasPage } from './peliculas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeliculasPageRoutingModule
  ],
  declarations: [PeliculasPage]
})
export class PeliculasPageModule {}