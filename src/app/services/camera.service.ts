import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {}

  async takePicture(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera // Usa la cámara como fuente
      });

      return image.dataUrl ?? null; // Devuelve la imagen en formato base64 o null si es undefined
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }}
