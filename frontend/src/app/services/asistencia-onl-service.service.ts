import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddAsistencia, ClaseAsistencia, IAsistenciaOnline } from '../models/asistenciaOnline';
import { UsuarioBD } from '../models/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaOnlServiceService {

  AUTH_SERVER = 'http://localhost:3000';

  private token: string;

  constructor(private httpClient: HttpClient){}

  guardarArrayAsistenciaOnlineBD(asistencia: IAsistenciaOnline[]): Promise<any> {

    return this.httpClient.post<UsuarioBD>(`${this.AUTH_SERVER}/asistenciaOnline/`, asistencia).toPromise();

  }

  addAsistenciaClase(clase: AddAsistencia): Promise<ClaseAsistencia> {
    return this.httpClient.post<ClaseAsistencia>(`${this.AUTH_SERVER}/clases/addAsignatura`, clase).toPromise();

  }

  getAsistenciaClase(clase: AddAsistencia): Promise<ClaseAsistencia> {
    return this.httpClient.post<ClaseAsistencia>(`${this.AUTH_SERVER}/clases/getNumAsistencias`, clase).toPromise();

  }
 }
