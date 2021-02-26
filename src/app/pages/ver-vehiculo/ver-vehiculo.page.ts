import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TrabajarVehiculoPage } from '../trabajar-vehiculo/trabajar-vehiculo.page';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-ver-vehiculo',
  templateUrl: './ver-vehiculo.page.html',
  styleUrls: ['./ver-vehiculo.page.scss'],
})
export class VerVehiculoPage implements OnInit {

  @Input() vehiculo;
  @Input() ordenEspecifica;
  @Input() i;
  @Input() ind;

  viewEntered;

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  constructor(private modalController: ModalController, private loadingController: LoadingController, private platform: Platform) { }

  ngOnInit() {
    console.log(this.vehiculo);
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 1000);
  }

  back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  async mostrarModalVehiculo() {
    await this.presentLoading();
    const vehiculoTrabajando = await this.vehiculo;
    const ordenEspe = await this.ordenEspecifica;
    const index = await this.i;
    const ind = await this.ind;
    const modal = await this.modalController.create({
      component: TrabajarVehiculoPage,
      backdropDismiss: false,
      componentProps: { vehiculoTrabajando,  ordenEspe, index, ind}
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value) {
      console.log(value);
    }else{
      console.log('no data');
    }
  }

}
