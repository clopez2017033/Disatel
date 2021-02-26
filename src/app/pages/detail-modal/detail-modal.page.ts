import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { VerVehiculoPage } from '../ver-vehiculo/ver-vehiculo.page';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { VerDatosPage } from '../ver-datos/ver-datos.page';
import { VerSIMPage } from '../ver-sim/ver-sim.page';
import { ModalObservacionesPage } from '../modal-observaciones/modal-observaciones.page';
import { Storage } from '@ionic/storage';
import { DataSyncService } from '../../services/data-sync.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DisatelService } from '../../services/disatel.service';
import { AlertService } from '../../services/alert.service';
import { NombreImagenPage } from '../nombre-imagen/nombre-imagen.page';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.page.html',
  styleUrls: ['./detail-modal.page.scss'],
})
export class DetailModalPage implements OnInit {

  @Input() orden;
  @Input() i;

  recharge: boolean;
  x = false;
  fecha;
  hora;
  fotos = [];
  photo;
  mostrarFoto = false;
  photoFile = null;
  photosFile = [];
  sended;
  viewEntered = false;

  ionViewDidEnter() {
    setTimeout(() => {
      this.viewEntered = true;
    }, 500);
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  constructor(private modalController: ModalController, private callNumber: CallNumber, private storage: Storage,
              private dataSync: DataSyncService, public loadingController: LoadingController, private camera: Camera,
              private disatelService: DisatelService, private aletService: AlertService, private alertService: AlertService,
              private platform: Platform) {
  }

  ngOnInit() {
    console.log(this.orden);
    this.loadingController.dismiss();
  }

  back(){
    this.recharge = false;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss(this.recharge);
    });
    this.modalController.dismiss(this.recharge);
  }

  onClick(numeros){
    this.callNumber.callNumber(numeros, true);
  }

  async mostrarModal( vehiculo, ind ) {
    await this.presentLoading();
    const ordenEspecifica = this.orden;
    const i = this.i;
    const modal = await this.modalController.create({
      component: VerVehiculoPage,
      backdropDismiss: false,
      componentProps: { vehiculo, ordenEspecifica, ind, i }
    });
    await modal.present();
  }

  async mostrarModalEquipo( equipo ) {
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: VerDatosPage,
      backdropDismiss: false,
      componentProps: { equipo }
    });
    await modal.present();
  }

  async mostrarModalSim( sim ) {
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: VerSIMPage,
      backdropDismiss: false,
      componentProps: { sim }
    });
    await modal.present();
  }

  async SalirDeSede() {
      await this.presentLoading();
      const objDetalles = await {
        titulo: 'Salir de sede',
        icon: 'car',
        orden: this.orden
      };
      const modal = await this.modalController.create({
        component: ModalObservacionesPage,
        cssClass: 'with-top',
        componentProps: { objDetalles }
      });
      await modal.present();

      const value: any = await modal.onDidDismiss();
      if (value.data.atras === false){
        this.orden = value.data.ordenModificada;
        console.log(value.data);
        this.loadingController.dismiss();
        if (value.data.service !== ''){
          this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones, value.data.ordenModificada.codigo,
                                    value.data.vehiculo);
          this.alertService.presentToast('Salió de sede con éxito', 'dark', 2000);
        }
        const ordenes = await this.storage.get('ordenes');
        ordenes[this.i] = this.orden;
        this.storage.set('ordenes', ordenes);
        this.alertService.presentToast('Salió de sede con éxito', 'dark', 2000);
      }else{
        console.log(value.data.atras);
      }
  }

  async presenteCliente() {
    await this.presentLoading();
    const objDetalles = await {
      titulo: 'Presente en ubicación',
      icon: 'location',
      orden: this.orden
    };
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      cssClass: 'with-top',
      componentProps: { objDetalles }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data.atras === false){
      this.orden = value.data.ordenModificadaPresente;
      console.log(value.data);
      this.loadingController.dismiss();
      if (value.data.service !== ''){
        this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones,
                                  value.data.ordenModificadaPresente.codigo, value.data.vehiculo);
        this.alertService.presentToast('Presente con el cliente!', 'dark', 2000);
      }
      const ordenes = await this.storage.get('ordenes');
      ordenes[this.i] = this.orden;
      this.storage.set('ordenes', ordenes);
      this.alertService.presentToast('Presente con el cliente!', 'dark', 2000);
    }else{
      console.log(value.data.atras);
    }
  }

  async finalizarOrden() {
    await this.presentLoading();
    const objDetalles = await {
      titulo: 'Finalizar orden',
      icon: 'checkbox',
      orden: this.orden
    };
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      cssClass: 'with-top',
      componentProps: { objDetalles }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data.atras === false){
      this.orden = value.data.ordenModificadaIniciado;
      console.log(value.data);
      this.loadingController.dismiss();
      if (value.data.service !== ''){
        this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones,
                                  value.data.ordenModificadaIniciado.codigo, value.data.vehiculo);
        const ordenesLocal = await this.storage.get('ordenes');
        ordenesLocal[this.i] = this.orden;
        this.storage.set('ordenes', ordenesLocal);
        this.alertService.presentToast('Orden finalizada con éxito', 'success', 2000);
      }else{
        this.alertService.presentToast('Orden finalizada con éxito', 'success', 2000);
        const ordenes = await this.storage.get('ordenes');
        await ordenes.splice(this.i, 1);
        await this.storage.set('ordenes', ordenes);
        this.recharge = true;
        this.modalController.dismiss(this.recharge);
      }
    }else{
      console.log(value.data.atras);
    }
}

async cancelarOrden() {
  await this.presentLoading();
  const objDetalles = await {
    titulo: 'Cancelar orden',
    icon: 'close-circle',
    orden: this.orden
  };
  const modal = await this.modalController.create({
    component: ModalObservacionesPage,
    cssClass: 'with-top',
    componentProps: { objDetalles }
  });
  await modal.present();

  const value: any = await modal.onDidDismiss();
  if (value.data.atras === false){
    this.orden = value.data.ordenModificada;
    console.log(value.data);
    this.loadingController.dismiss();
    if (value.data.service !== ''){
      this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones, value.data.ordenModificada.codigo,
                                value.data.vehiculo);
      const ordenesLocal = await this.storage.get('ordenes');
      ordenesLocal[this.i] = this.orden;
      this.storage.set('ordenes', ordenesLocal);
      this.alertService.presentToast('Orden cancelada con éxito', 'warning', 2000);
    }else{
      this.alertService.presentToast('Orden cancelada con éxito', 'warning', 2000);
      const ordenes = await this.storage.get('ordenes');
      await ordenes.splice(this.i, 1);
      await this.storage.set('ordenes', ordenes);
      this.recharge = true;
      this.modalController.dismiss(this.recharge);
    }
  }else{
    console.log(value.data.atras);
  }
}

async ordenFallida() {
  await this.presentLoading();
  const objDetalles = await {
    titulo: 'Orden fallida',
    icon: 'close-circle-outline',
    orden: this.orden
  };
  const modal = await this.modalController.create({
    component: ModalObservacionesPage,
    cssClass: 'with-top',
    componentProps: { objDetalles }
  });
  await modal.present();

  const value: any = await modal.onDidDismiss();
  if (value.data.atras === false){
    this.orden = value.data.ordenModificada;
    console.log(value.data);
    this.loadingController.dismiss();
    if (value.data.service !== ''){
      this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones, value.data.ordenModificada.codigo,
                                value.data.vehiculo);
      const ordenesLocal = await this.storage.get('ordenes');
      ordenesLocal[this.i] = this.orden;
      this.storage.set('ordenes', ordenesLocal);
      this.alertService.presentToast('Orden fallida', 'danger', 2000);
    }else{
      this.alertService.presentToast('Orden fallida', 'danger', 2000);
      const ordenes = await this.storage.get('ordenes');
      await ordenes.splice(this.i, 1);
      await this.storage.set('ordenes', ordenes);
      this.recharge = true;
      this.modalController.dismiss(this.recharge);
    }
  }else{
    console.log(value.data.atras);
  }
}

dataURLtoFile(dataurl, filename) {
  // tslint:disable-next-line: one-variable-per-declaration
  let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  while (n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

async takePicture() {
  const options: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    allowEdit: false
  };

  this.camera.getPicture(options).then(async (imageData) => {
  const base64Image = 'data:image/jpeg;base64,' + imageData;
  this.photo = base64Image;
  const modal = await this.modalController.create({
    component: NombreImagenPage,
    cssClass: 'width-height'
  });
  await modal.present();

  const value: any = await modal.onDidDismiss();
  if (value){
    console.log(value);
    this.photoFile = await this.dataURLtoFile(this.photo, value.data);
    console.log(this.photoFile);
    this.fotos.push(this.photo);
    console.log(this.fotos);
    this.photosFile.push(this.photoFile);
    console.log(this.photosFile);
    this.mostrarFoto = true;
  }
  }, (err) => {
    console.log(err);
  });
}


openGallery() {
  const galleryOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    destinationType: this.camera.DestinationType.DATA_URL,
    allowEdit: false
    };

  this.camera.getPicture(galleryOptions).then(async (imgData) => {
    const base64Image = 'data:image/jpeg;base64,' + imgData;
    this.photo = base64Image;
    const modal = await this.modalController.create({
      component: NombreImagenPage,
      cssClass: 'width-height'
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value){
      console.log(value);
      this.photoFile = await this.dataURLtoFile(this.photo, value.data);
      console.log(this.photoFile);
      this.fotos.push(this.photo);
      console.log(this.fotos);
      this.photosFile.push(this.photoFile);
      console.log(this.photosFile);
      this.mostrarFoto = true;
    }
    }, (err) => {
      console.log(err);
    });
  }

  deletePhotoArray(index){
    this.fotos.splice(index, 1);
    this.photosFile.splice(index, 1);
  }

  async subirImagenes(){
    await this.presentLoading();
    await this.photosFile.forEach(async element => {
      (await this.disatelService.postFotoOrden(this.orden.codigo, element))
        .subscribe(resp => {
            console.log(resp);
            this.fotos.splice(0, 1);
            this.photosFile.splice(0, 1);
        });
    });
    this.loadingController.dismiss();
    this.aletService.presentToast('La(s) imágen(es) fueron enviadas al servidor', 'success', 3000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

}
