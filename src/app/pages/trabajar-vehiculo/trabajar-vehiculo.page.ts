import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalObservacionesPage } from '../modal-observaciones/modal-observaciones.page';
import { DataSyncService } from '../../services/data-sync.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DisatelService } from '../../services/disatel.service';
import { AlertService } from '../../services/alert.service';
import { UbicacionEquipoPage } from '../ubicacion-equipo/ubicacion-equipo.page';
import { NombreImagenPage } from '../nombre-imagen/nombre-imagen.page';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-trabajar-vehiculo',
  templateUrl: './trabajar-vehiculo.page.html',
  styleUrls: ['./trabajar-vehiculo.page.scss'],
})
export class TrabajarVehiculoPage implements OnInit {

  @Input() vehiculoTrabajando;
  @Input() ordenEspe;
  @Input() index;
  @Input() ind;
  atras: boolean;
  fechaHora;
  objVehiculo;
  equipo;
  fotos = [];
  mostrarFoto = false;
  photoFile = null;
  photosFile = [];
  photo;
  canSelectSim = false;
  sim;
  sended: boolean;
  viewEntered;

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  constructor(private modalController: ModalController, private storage: Storage, private dataSync: DataSyncService,
              private disatelService: DisatelService, private alertService: AlertService, private loadingController: LoadingController,
              private camera: Camera, private platform: Platform) {
    this.atras = true;
  }

  ngOnInit() {
    console.log(this.vehiculoTrabajando);
    console.log(this.ordenEspe);
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 1000);
  }

  async back(){
    this.atras = true;
    this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss(this.atras);
    });
    this.modalController.dismiss(this.atras);
  }

  getDate(){
    let todayDate;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    todayDate = dd + '/' + mm + '/' + yyyy;
    return todayDate;
  }

  getHour(){
    const hoy = new Date();
    const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    return hora;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  async iniciarTrabajo(){
    await this.presentLoading();
    this.atras = false;
    const objDetails = await {
      index: this.index,
      ind: this.ind,
    };
    const objDetalles = await {
      titulo: 'Iniciar trabajo',
      icon: 'clock',
      orden: this.ordenEspe,
      obj: objDetails
    };
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      cssClass: 'with-top',
      componentProps: { objDetalles }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data.atras === false){
      this.ordenEspe = value.data.ordenModificadaIniciado;
      console.log(value.data);
      this.loadingController.dismiss();
      if (value.data.service !== ''){
        this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones,
                                  value.data.ordenModificadaIniciado.codigo, value.data.vehiculo);
      }
      const ordenes = await this.storage.get('ordenes');
      ordenes[this.index] = this.ordenEspe;
      this.storage.set('ordenes', ordenes);
      this.alertService.presentToast('Vehículo iniciado con éxito', 'dark', 2000);
    }else{
      console.log(value.data.atras);
    }
  }

  async finalizarTrabajo(){
    await this.presentLoading();
    this.atras = false;
    const objDetails = await {
      index: this.index,
      ind: this.ind,
    };
    const objDetalles = await {
      titulo: 'Finalizar vehiculo',
      icon: 'checkbox',
      orden: this.ordenEspe,
      obj: objDetails
    };
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      cssClass: 'with-top',
      componentProps: { objDetalles }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data.atras === false){
      this.ordenEspe = value.data.ordenModificadaIniciado;
      console.log(value.data);
      this.loadingController.dismiss();
      if (value.data.service !== ''){
        this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones,
                                  value.data.ordenModificadaIniciado.codigo, value.data.vehiculo);
      }
      const ordenes = await this.storage.get('ordenes');
      ordenes[this.index] = this.ordenEspe;
      this.storage.set('ordenes', ordenes);
      this.alertService.presentToast('Vehículo finalizado con éxito', 'success', 2000);
    }else{
      console.log(value.data.atras);
    }
  }

  async cancelarTrabajo(){
    await this.presentLoading();
    this.atras = false;
    const objDetails = await {
      index: this.index,
      ind: this.ind,
    };
    const objDetalles = await {
      titulo: 'Cancelar vehiculo',
      icon: 'close-circle',
      orden: this.ordenEspe,
      obj: objDetails
    };
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      cssClass: 'with-top',
      componentProps: { objDetalles }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data.atras === false){
      this.ordenEspe = value.data.ordenModificadaIniciado;
      console.log(value.data);
      this.loadingController.dismiss();
      if (value.data.service !== ''){
        this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones,
                                  value.data.ordenModificadaIniciado.codigo, value.data.vehiculo);
      }
      const ordenes = await this.storage.get('ordenes');
      ordenes[this.index] = this.ordenEspe;
      this.storage.set('ordenes', ordenes);
      this.alertService.presentToast('Vehículo cancelado con éxito', 'warning', 2000);
    }else{
      console.log(value.data.atras);
    }
  }

  async trabajoFallido(){
    await this.presentLoading();
    this.atras = false;
    const objDetails = await {
      index: this.index,
      ind: this.ind,
    };
    const objDetalles = await {
      titulo: 'Vehiculo fallido',
      icon: 'close-circle-outline',
      orden: this.ordenEspe,
      obj: objDetails
    };
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      cssClass: 'with-top',
      componentProps: { objDetalles }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data.atras === false){
      this.ordenEspe = value.data.ordenModificadaIniciado;
      console.log(value.data);
      this.loadingController.dismiss();
      if (value.data.service !== ''){
        this.dataSync.saveService(value.data.service, value.data.fechaHora, value.data.observaciones,
                                  value.data.ordenModificadaIniciado.codigo, value.data.vehiculo);
      }
      const ordenes = await this.storage.get('ordenes');
      ordenes[this.index] = this.ordenEspe;
      this.storage.set('ordenes', ordenes);
      this.alertService.presentToast('Vehículo fallido', 'danger', 2000);
    }else{
      console.log(value.data.atras);
    }
  }

  async seleccionarEquipo(event){
    this.atras = false;
    this.equipo = await event.detail.value.slice(16, 20);
    console.log(this.equipo);
    const objDetails = await {
      index: this.index,
      ind: this.ind,
      equipo: this.equipo
    };
    const objDetalles = await {
      titulo: 'Seleccionar equipo',
      icon: 'list-circle',
      orden: this.ordenEspe,
      obj: objDetails
    };
    const modal = await this.modalController.create({
      component: UbicacionEquipoPage,
      cssClass: 'with-top',
      componentProps: { objDetalles }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data.atras === false){
      this.ordenEspe = value.data.ordenModificadaIniciado;
      this.canSelectSim = true;
      this.alertService.presentToast('Equipo seleccionado con éxito', 'dark', 2000);
      if (value.data.service !== ''){
        this.dataSync.saveServiceEquipo(value.data.service, value.data.fechaHora, value.data.ubicacion,
                                        value.data.ordenModificadaIniciado.codigo, value.data.vehiculo, value.data.equipo);
      }
    }else{
      console.log(value.data.atras);
      this.alertService.presentToast('El equipo no ha sido seleccionado', 'dark', 2000);
      this.canSelectSim = false;
    }
  }

  async seleccionarSim(event){
    if ( this.canSelectSim === true ){
      this.fechaHora = this.getDate() + ' ' + this.getHour();
      this.sim = await event.detail.value.slice(12, 16);
      const isOnLine = await navigator.onLine;
      console.log(this.equipo);
      if (isOnLine){
        (await this.disatelService.seleccionarSim(this.ordenEspe.codigo, this.vehiculoTrabajando.codigo, this.sim, this.fechaHora,
                                                  this.equipo))
        .subscribe((resp: any) => {
          if (resp.status === false){
            this.alertService.presentToast('Sim seleccionada con éxito', 'dark', 2000);
            this.dataSync.saveServiceSim('saveSim', this.fechaHora, this.sim, this.ordenEspe.codigo, this.vehiculoTrabajando.codigo,
                                      this.equipo);
          }else{
            this.alertService.presentToast('Sim seleccionada con éxito', 'dark', 2000);
          }
        });
      }else{
        this.dataSync.saveServiceSim('saveSim', this.fechaHora, this.sim, this.ordenEspe.codigo, this.vehiculoTrabajando.codigo,
                                      this.equipo);
      }
    }else{
      this.alertService.presentAlert('Para seleccionar una SIM primero debes de elegir a que equipo se le aignará.');
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
      this.photosFile.forEach(async element => {
        (await this.disatelService.postFotoVehiculo(this.ordenEspe.codigo, this.vehiculoTrabajando.codigo, element))
          .subscribe(resp => {
              this.fotos.splice(0, 1);
              this.photosFile.splice(0, 1);
              console.log(resp);
            });
        });
      this.loadingController.dismiss();
      this.alertService.presentToast('La(s) imágen(es) fueron enviadas al servidor', 'success', 3000);
    }

}
