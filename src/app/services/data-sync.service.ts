import { Injectable } from '@angular/core';
import {
  Storage
} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataSyncService {

  execute = [];
  equipo = [];
  sim = [];

  constructor( private storage: Storage ) {
    this.cargarStorage();
  }

  async cargarStorage() {
    this.execute = await this.storage.get('execute') || [];
    this.equipo = await this.storage.get('equipo') || [];
  }

  async saveService( service, fechaHora, observaciones, ot, codVehiculo ) {
    await this.cargarStorage();
    const objExecute = await {
      servicio: service,
      fechaYHora: fechaHora,
      Observaciones: observaciones,
      vehiculo: codVehiculo,
      orden: ot
    };
    this.execute.push( objExecute );
    this.storage.set('execute', this.execute);
  }

  async saveServiceEquipo( service, fechaHora, ubicacion, ot, codVehiculo, equipo ) {
    await this.cargarStorage();
    const objEquipo = await {
      servicio: service,
      fechaYHora: fechaHora,
      Ubicacion: ubicacion,
      vehiculo: codVehiculo,
      orden: ot,
      Equipo: equipo
    };
    this.execute.push( objEquipo );
    this.storage.set('equipo', this.equipo);
  }

  async saveServiceSim( service, fechaHora, sim, ot, codVehiculo, equipo ) {
    await this.cargarStorage();
    const objSim = await {
      servicio: service,
      fechaYHora: fechaHora,
      Sim: sim,
      vehiculo: codVehiculo,
      orden: ot,
      Equipo: equipo
    };
    this.execute.push( objSim );
    this.storage.set('sim', this.sim);
  }

}
