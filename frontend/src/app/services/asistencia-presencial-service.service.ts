import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { IAsistenciaOnline } from '../models/asistenciaOnline';
import { IAsistencia, RespuestaBDListarAlumnos, RespuestaBDListarAsistencia } from '../models/asistenciaPresencial';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaPresencialService {
  AUTH_SERVER = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  listarAlumnosBD(claseI: string): Promise<RespuestaBDListarAlumnos> {

    const clase = {
      clase: claseI
    };

    // tslint:disable-next-line: max-line-length
    return this.httpClient.post<RespuestaBDListarAlumnos>(`${this.AUTH_SERVER}/asistenciaPresencial/listarNombresAlumnos`, clase).toPromise();

  }

  marcarAsistencia(usuario: IAsistenciaOnline, asiste: boolean): Promise<any> {

    return this.httpClient.post<IAsistencia>(`${this.AUTH_SERVER}/asistenciaPresencial/marcarAsistencia`, usuario).toPromise();

  }

  listarAsistenciasTotales(claseI: string): Promise<RespuestaBDListarAsistencia> {

    const clase = {
      clase: claseI
    };

    // tslint:disable-next-line: max-line-length
    return this.httpClient.post<RespuestaBDListarAsistencia>(`${this.AUTH_SERVER}/asistenciaPresencial/listarAsitenciasTotales`, clase).toPromise();

  }
}
