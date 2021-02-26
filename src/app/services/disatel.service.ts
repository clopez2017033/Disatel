import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { Data } from '../interfaces/Data';

const disatelUrl = environment.disatelUrl;
const disatelEjecutar = environment.disatelEjecutar;
const fotoVehiculo = environment.fotoVehiculo;
const fotoOrden = environment.fotoOrden;
const notification = environment.notification;

@Injectable({
  providedIn: 'root'
})
export class DisatelService {

  data: object = null;
  datosUsuario;

  constructor(private http: HttpClient, private storage: Storage) { }

  async getOrdenesTrabajo<T>( usuario ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelUrl}ordenes_asignadas&usuario=${usuario}`);
  }

  async ejecutarOT<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}salir&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async presenteCliente<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://${this.datosUsuario.dominio}${disatelEjecutar}presente&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}presente&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async finalizarOrden<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}finalizar&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async ordenFallida<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}fallida&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async ordenCancelada<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}cancelar&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async iniciarVehículo<T>( ot, vehiculo, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}inicarVehiculo&ot=${ot}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async finalizarVehículo<T>( ot, vehiculo, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}finalizarVehiculo&ot=${ot}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async fallidoVehículo<T>( ot, vehiculo, observaciones,  fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}fallidoVehiculo&ot=${ot}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async cancelarVehículo<T>( ot, vehiculo, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}cancelarVehiculo&ot=${ot}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async seleccionarSim<T>( ot, vehiculo, sim, fechaHora, equipo ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}selecciona_sim&ot=${ot}&sim=${sim}&equipo=${equipo}&vehiculo=${vehiculo}&fecha_hora=${fechaHora}&usuario=${this.datosUsuario.codigo}`);
  }

  async seleccionarEquipo<T>( ot, vehiculo, equipo, fechaHora, ubicacion ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}selecciona_equipo&ot=${ot}&equipo=${equipo}&ubicacion=${ubicacion}&vehiculo=${vehiculo}&fecha_hora=${fechaHora}&usuario=${this.datosUsuario.codigo}`);
  }

  async postFotoVehiculo<T>( ot, vehiculo, file ){
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.datosUsuario = await this.storage.get('datos');
    return this.http.post(`https://${this.datosUsuario.dominio}${fotoVehiculo}&ot=${ot}&vehiculo=${vehiculo}`, fd);
  }

  async postFotoOrden<T>( ot, file ){
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://${this.datosUsuario.dominio}${fotoOrden}&ot=${ot}`, fd);
    return this.http.post(`https://${this.datosUsuario.dominio}${fotoOrden}&ot=${ot}`, fd);
  }

  async eliminarFotoOt<T>( ot, vehiculo, codigos ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}deleteimagen&ot=${ot}&vehiculo=${vehiculo}&codigos=${codigos}`);
  }

  async eliminarFotoVehiculo<T>( ot, codigos ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${disatelEjecutar}deleteimagenVehiculo&ot=${ot}&codigos=${codigos}`);
  }

  // NOTIFICAIONES

  async registrarDispositivo<T>( deviceId, token){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${notification}register&user_id=${this.datosUsuario.codigo}&device_id=${deviceId}&device_token=${token}&device_type=android&certificate_type=1`);
  }

  async quitarDispositivo<T>( deviceId, token){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${notification}unregister&user_id=${this.datosUsuario.codigo}&device_id=${deviceId}&device_token=${token}&device_type=android&certificate_type=1`);
  }

  async listNotifications<T>(page){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://${this.datosUsuario.dominio}${notification}list&user_id=${this.datosUsuario.codigo}type=&page=
                            ${page}`);
  }

}
