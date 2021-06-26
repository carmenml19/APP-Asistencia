import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddAsistencia, ClaseAsistencia, IAsistenciaOnline } from '../models/asistenciaOnline';
import { UsuarioBD } from '../models/jwt-response';
import { Notas, RespuestaBdNotas } from '../models/notas';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  AUTH_SERVER = 'http://localhost:3000';


  constructor(private httpClient: HttpClient){}

  guardarArrayNotasBD(notas: Notas[]): Promise<any> {

    return this.httpClient.post<UsuarioBD>(`${this.AUTH_SERVER}/notas/`, notas).toPromise();

  }

  getNotasBD(clase: AddAsistencia): Promise<RespuestaBdNotas> {
    return this.httpClient.post<RespuestaBdNotas>(`${this.AUTH_SERVER}/notas/listarNotas`, clase).toPromise();

  }
 }
