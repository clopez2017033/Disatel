import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-ver-sim',
  templateUrl: './ver-sim.page.html',
  styleUrls: ['./ver-sim.page.scss'],
})
export class VerSIMPage implements OnInit {

  @Input() sim;
  viewEntered;

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  constructor(private modalController: ModalController, private loadingController: LoadingController, private platform: Platform) { }

  ngOnInit() {
    console.log(this.sim);
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

}
