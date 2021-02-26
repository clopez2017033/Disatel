import {
  Component, OnInit
} from '@angular/core';
import {
  AlertService
} from '../../services/alert.service';
import {
  Router
} from '@angular/router';
import {
  Storage
} from '@ionic/storage';
import {
  UserService
} from '../../services/user.service';
import {
  Data,
  RootObject
} from '../../interfaces/Data';
import {
  DisatelService
} from '../../services/disatel.service';
import { LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { DetailModalPage } from '../detail-modal/detail-modal.page';
import { DataSyncService } from '../../services/data-sync.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  skeletonScreen = Array(3);
  urlFoto;
  cardSkeleton: boolean;
  ordenesDeTrabajo;
  noData: boolean;
  token;

  constructor(private router: Router, private userService: UserService, private storage: Storage, private alertService: AlertService,
              private disatelService: DisatelService, private modalController: ModalController, public dataSync: DataSyncService,
              public loadingController: LoadingController, private fcm: FCM, private device: Device,
              public toastController: ToastController) {
                this.cardSkeleton = true;
                this.noData = false;
              }

  async ngOnInit() {
    const notification = await this.storage.get('notification');
    if (notification === true){
      this.fcm.getToken().then(token => {
        this.token = token;
        this.disatelService.registrarDispositivo(this.device.uuid, this.token);
      });
      await this.storage.set('notification', false);
    }
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped){
        this.router.navigateByUrl('/home');
        console.log('Received in background', data);
      } else {
        console.log('Received in foreground', data);
        this.presentToastWithOptions();
      }
    });
  }

  async sync(){
    const isOnLine = navigator.onLine;
    if (isOnLine){
        if (this.dataSync.execute.length === 0 && this.dataSync.equipo.length === 0 && this.dataSync.sim.length === 0){
          this.getData();
          console.log(this.dataSync.execute);
          console.log(this.dataSync.equipo);
          console.log(this.dataSync.sim);
        }else{
          await this.dataSync.execute.forEach( async ele => {
            if (ele.servicio === 'salir'){
              (await this.disatelService.ejecutarOT(ele.orden, ele.observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'presente'){
              (await this.disatelService.presenteCliente(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'iniciar'){
              (await this.disatelService.iniciarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                      await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Finalizar'){
              (await this.disatelService.finalizarOrden(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Cancelar'){
              (await this.disatelService.ordenCancelada(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Fallida'){
              (await this.disatelService.ordenFallida(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Finalizar vehiculo'){
              (await this.disatelService.finalizarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Cancelar vehiculo'){
              (await this.disatelService.cancelarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Vehiculo fallido'){
              (await this.disatelService.fallidoVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            }
          });
          await this.dataSync.equipo.forEach( async elem => {
            (await this.disatelService.seleccionarEquipo(elem.orden, elem.vehiculo, elem.Equipo, elem.fechaYHora, elem.Ubicacion))
              .subscribe(async resp =>
                await this.dataSync.equipo.splice(0, 1),
                await this.storage.set('equipo', this.dataSync.equipo));
            });
          await this.dataSync.sim.forEach( async elem => {
            (await this.disatelService.seleccionarSim(elem.orden, elem.vehiculo, elem.Sim, elem.fechaYHora, elem.Equipo))
              .subscribe(async resp =>
                await this.dataSync.sim.splice(0, 1),
                await this.storage.set('sim', this.dataSync.sim));
            });
          this.getData();
          this.dataSync.execute = [];
          this.storage.set('execute', this.dataSync.execute);
          this.dataSync.equipo = [];
          this.storage.set('equipo', this.dataSync.equipo);
          this.dataSync.sim = [];
          this.storage.set('sim', this.dataSync.sim);
          console.log(this.dataSync.execute);
          console.log(this.dataSync.equipo);
          console.log(this.dataSync.sim);
        }
      }else{
      this.alertService.presentToast('Conéctate a internet para poder sincronizar!', 'warning', 2000);
    }
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Disatel',
      message: 'Tiene una nueva notificación...',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'arrow-forward-circle-outline',
          text: 'Ir',
          handler: () => {
            this.router.navigateByUrl('/notificaciones');
          }
        }, {
          text: 'cerrar',
          role: 'cancel',
          handler: () => {
            this.toastController.dismiss();
          }
        }
      ]
    });
    toast.present();
  }

  async ionViewWillEnter() {
    this.cardSkeleton = true;
    const isOnLine = navigator.onLine;
    if (isOnLine){
        if (this.dataSync.execute.length === 0 && this.dataSync.equipo.length === 0 && this.dataSync.sim.length === 0){
          this.getData();
          console.log(this.dataSync.execute);
          console.log(this.dataSync.equipo);
          console.log(this.dataSync.sim);
        }else{
          await this.dataSync.execute.forEach( async ele => {
            if (ele.servicio === 'salir'){
              (await this.disatelService.ejecutarOT(ele.orden, ele.observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'presente'){
              (await this.disatelService.presenteCliente(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'iniciar'){
              (await this.disatelService.iniciarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                      await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Finalizar'){
              (await this.disatelService.finalizarOrden(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Cancelar'){
              (await this.disatelService.ordenCancelada(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Fallida'){
              (await this.disatelService.ordenFallida(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Finalizar vehiculo'){
              (await this.disatelService.finalizarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Cancelar vehiculo'){
              (await this.disatelService.cancelarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Vehiculo fallido'){
              (await this.disatelService.fallidoVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            }
          });
          await this.dataSync.equipo.forEach( async elem => {
            (await this.disatelService.seleccionarEquipo(elem.orden, elem.vehiculo, elem.Equipo, elem.fechaYHora, elem.Ubicacion))
              .subscribe(async resp =>
                await this.dataSync.equipo.splice(0, 1),
                await this.storage.set('equipo', this.dataSync.equipo));
            });
          await this.dataSync.sim.forEach( async elem => {
            (await this.disatelService.seleccionarSim(elem.orden, elem.vehiculo, elem.Sim, elem.fechaYHora, elem.Equipo))
              .subscribe(async resp =>
                await this.dataSync.sim.splice(0, 1),
                await this.storage.set('sim', this.dataSync.sim));
            });
          this.getData();
          this.dataSync.execute = [];
          this.storage.set('execute', this.dataSync.execute);
          this.dataSync.equipo = [];
          this.storage.set('equipo', this.dataSync.equipo);
          this.dataSync.sim = [];
          this.storage.set('sim', this.dataSync.sim);
          console.log(this.dataSync.execute);
          console.log(this.dataSync.equipo);
          console.log(this.dataSync.sim);
        }
      }else{
        this.ordenesDeTrabajo = await this.storage.get('ordenes');
        if (this.ordenesDeTrabajo){
          this.noData = false;
        }else{
          this.noData = true;
        }
        this.cardSkeleton = false;
        console.log(this.ordenesDeTrabajo);
      }
  }

async getData() {
    const datosUsuario = await this.storage.get('datos');
    console.log(datosUsuario);
    if (datosUsuario) {
      (await this.userService.getFoto(datosUsuario.codigo)).subscribe((resp: Data) => {
        this.urlFoto = resp.data.url_foto;
        this.getOrdenesTrabajo(datosUsuario);
      });
    }
  }

async getOrdenesTrabajo < T >(datosUsuario) {
    if (datosUsuario) {
      (await this.disatelService.getOrdenesTrabajo(datosUsuario.codigo)).subscribe((resp: RootObject) => {
        this.ordenesDeTrabajo = resp.data;
        if (this.ordenesDeTrabajo.length === 0){
          this.noData = true;
        }else{
          this.noData = false;
        }
        this.storage.set('ordenes', this.ordenesDeTrabajo);
        console.log(this.ordenesDeTrabajo);
        this.cardSkeleton = false;
      });
    }
  }

  async logOut(){
    await this.disatelService.quitarDispositivo(this.device.uuid, this.token);
    this.storage.remove('datos');
    this.storage.remove('ordenes');
    this.router.navigateByUrl('/login');
  }

  async doRefresh(event){
    const isOnLine = navigator.onLine;
    this.cardSkeleton = true;
    if (isOnLine){
        if (this.dataSync.execute.length === 0 && this.dataSync.equipo.length === 0){
          this.getData().then(() => {
            event.target.complete();
          });
        }else{
          await this.dataSync.execute.forEach( async ele => {
            if (ele.servicio === 'salir'){
              (await this.disatelService.ejecutarOT(ele.orden, ele.observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'presente'){
              (await this.disatelService.presenteCliente(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'iniciar'){
              (await this.disatelService.iniciarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                      await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Finalizar'){
              (await this.disatelService.finalizarOrden(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Cancelar'){
              (await this.disatelService.ordenCancelada(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Fallida'){
              (await this.disatelService.ordenFallida(ele.orden, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Finalizar vehiculo'){
              (await this.disatelService.finalizarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Cancelar vehiculo'){
              (await this.disatelService.cancelarVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            } else if (ele.servicio === 'Vehiculo fallido'){
              (await this.disatelService.fallidoVehículo(ele.orden, ele.vehiculo, ele.Observaciones, ele.fechaHora))
                .subscribe(async res => await this.dataSync.execute.splice(0, 1),
                                        await this.storage.set('execute', this.dataSync.execute));
            }
          });
          await this.dataSync.equipo.forEach( async elem => {
            (await this.disatelService.seleccionarEquipo(elem.orden, elem.vehiculo, elem.Equipo, elem.fechaYHora, elem.Ubicacion))
              .subscribe(async resp =>
                await this.dataSync.equipo.splice(0, 1),
                await this.storage.set('equipo', this.dataSync.equipo));
            });
          await this.dataSync.sim.forEach( async elem => {
            (await this.disatelService.seleccionarSim(elem.orden, elem.vehiculo, elem.Sim, elem.fechaYHora, elem.Equipo))
              .subscribe(async resp =>
                await this.dataSync.sim.splice(0, 1),
                await this.storage.set('sim', this.dataSync.sim));
            });
          this.getData().then(() => {
            event.target.complete();
          });
        }
      }else{
        this.ordenesDeTrabajo = await this.storage.get('ordenes');
        if (this.ordenesDeTrabajo){
          this.noData = false;
        }else{
          this.noData = true;
        }
        this.cardSkeleton = false;
        console.log(this.ordenesDeTrabajo);
      }
  }

async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

async mostrarModal( i ) {
    await this.presentLoading();
    const ordenes = await this.storage.get('ordenes');
    const orden = await ordenes[i];
    orden.vehiculos.forEach((ele) => {
      ele.color_status = '';
      if (ele.situacion_trabajo === 2) {
        ele.color_status = '--background: #D6EAF8;';
      } else if (ele.situacion_trabajo === 3) {
        ele.color_status = '--background: #D5F5E3;';
      }
    });
    const modal = await this.modalController.create({
      component: DetailModalPage,
      backdropDismiss: false,
      componentProps: { orden, i }
    });

    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data === true){
      this.cardSkeleton = true;
      this.noData = false;
      const datosUsuario = await this.storage.get('datos');
      if (datosUsuario){
        this.getOrdenesTrabajo( datosUsuario );
      }
    }
  }

}
