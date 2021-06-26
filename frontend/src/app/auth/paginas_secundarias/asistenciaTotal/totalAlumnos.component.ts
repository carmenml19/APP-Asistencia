import { Component, ElementRef, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser } from 'projects/ngx-csv-parser/src/public-api';
import { NgxCSVParserError } from 'projects/ngx-csv-parser/src/public-api';
import { AddAsistencia } from 'src/app/models/asistenciaOnline';
import { AsistenciaPresencialService } from 'src/app/services/asistencia-presencial-service.service';
import Swal from 'sweetalert2';
import { IAsistencia } from '../../../models/asistenciaPresencial';
import { AsistenciaOnlServiceService } from '../../../services/asistencia-onl-service.service';
import { AuthService } from '../../../services/auth.service';
import { UtilidadesService } from '../../../services/utilidades.service';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-totalAlumnos',
  templateUrl: './totalAlumnos.component.html',
  styleUrls: ['./totalAlumnos.component.css']
})
export class TotalAlumnosComponent implements OnInit {

  @ViewChild('tablaAsistenciaTotal') userTable: ElementRef;


  constructor(private ngxCsvParser: NgxCsvParser,
              private asistenciaPresencialService: AsistenciaPresencialService,
              private asistenciaOnlineService: AsistenciaOnlServiceService,
              private usuarioService: AuthService,
              private router: Router,
              private utilidadesService: UtilidadesService) {
}

  claseSeleccionada: string;

  csvRecords: IAsistencia[] = [];
  asistenciasOrdenadasPorAlumno: any[] = [];
  header = false;
  numClasesActualesOnline = 0;
  numClasesActualesPresenciales = 0;

  @ViewChild('fileImportInput') fileImportInput: any;

  async ngOnInit(): Promise<void> {

    if (this.usuarioService.usuario === undefined || this.usuarioService.usuario === null) {
      this.usuarioService.logout();
    } else {

      const clase = await Swal.fire({
        title: 'Clases',
        input: 'select',
        allowOutsideClick: false,
        showCancelButton: true,
        inputOptions: {
          'Primero Informática': {
            '1-ALG-6': 'Álgebra Lineal',
            '2-FTC-4,5': 'Fundamentos de Computadores',
            '3-LAB-6': 'Laboratorio de Informática',
            '4-FP1-4,5': 'Fundamentos de Programación 1',
            '5-CAL-6': 'Cálculo',
            '6-TEO-3': 'Teología',
            '7-ETR-6' : 'Estructura de Computadores',
            '8-MAT-4,5': 'Matemática Discreta',
            '9-FIS-6': 'Física',
            '10-FP2-4,5': 'Fundamentos de Programación 2',
            '11-FAO-6': 'Fundamentos de Administración y Organización de Empresas',
            '12-ETC-3': 'Ética'

          },
          'Segundo Informática': {
            '1-ALG-4,5': 'Algoritmia',
            '2-BBD-6': 'Bases de Datos',
            '3-EST-6': 'Estadística',
            '4-POO-4,5': 'Programación Orientada a Objetos',
            '5-IPM-4,5': 'Interfaz Persona Máquina',
            '6-ALE-4,5': 'Aspectos Legales y Éticos de la Informática',
            '7-SSO-6': 'Sistemas Operativos',
            '8-PVA-6': 'Programación Visual Avanzada',
            '9-RCS-6': 'Redes de Computadores',
            '10-SGI-6': 'Sistemas de Gestión de la Información',
            '11-ISW-6': 'Ingeniería del Software'
          },
          'Tercero Informática': {
            '1–PGP-4,5': 'Programación Paralela',
            '2-DD1-4,5': 'Desarrollo de Aplicaciones Distribuidas 1',
            '3-IGR-4,5': 'Ingeniería de Requisitos',
            '4-TAC-6': 'Tecnologías Avanzadas de Comunicación',
            '5-SIE-6': 'Soluciones Informáticas para la Empresa',
            '6-AQC-4,5': 'Arquitectura de Computadores',
            '7-DD2-6': 'Desarrollo de Aplicaciones Distribuidas 2',
            '8-GPI-4,5': 'Gestión de Proyectos Informáticos',
            '9-MSW-6': 'Modelado del Software',
            '10-SIT-4,5': 'Sistemas Inteligentes',
            '11-SIF-4,5': 'Seguridad de la Información',
            '12-PGW-4,5': 'Programación Web'
          },
          'Cuarto Informática': {
            '1–ABD-4,5': 'Administración de Bases de Datos',
            '2-CSW-4,5': 'Calidad del Software',
            '3-ADM-4,5': 'Aplicaciones para Dispositivos Móviles',
            '4-ASI-6': 'Administración de Sistemas',
            '5-IGC-6': 'Ingeniería del Conocimiento',
            '6-PIS-6': 'Proyecto Integral de Ingeniería del Software',
            '7-AYP-4,5': 'Auditoría y Peritaje',
            '8-PIT-4,5': 'Proyecto Integral de Tecnologías de la Información',
            '9-TFG-18': 'Trabajo Fin de Grado'
          }
        },
        inputPlaceholder: 'Seleccine una clase',
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value !== '') {
              resolve(null);
            } else {
              resolve('Necesita seleccionar una clase!');
            }
          });
        }
      });
      if (clase.value === undefined || clase.value === null ) {
        this.router.navigateByUrl('/home');
      } else {
        this.claseSeleccionada = clase.value;
        const claseAsistencia: AddAsistencia = {
          nombreClase: this.claseSeleccionada,
          facultad: this.usuarioService.usuario.facultad
        };
        this.asistenciaOnlineService.getAsistenciaClase(claseAsistencia).then(resp => {
          console.log('respssss: ', resp);
          if (resp.ok.toString() === 'true') {
            this.numClasesActualesOnline = parseInt(resp.numeroClasesOnline, 10);
            this.numClasesActualesPresenciales = parseInt(resp.numeroClasesPresenciales, 10);
          }
        });
        await this.asistenciaPresencialService.listarAsistenciasTotales(this.claseSeleccionada).then( resp => {
          console.log('resp BD: ', resp);
          this.csvRecords = resp.lista;
          if (this.csvRecords.length === 0) {
            Swal.fire({
              title: 'Error!',
              text: '¡Primero cargue el fichero de alumnos!',
              icon: 'error',
              confirmButtonText: 'Inicio',
              allowOutsideClick: false
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                this.router.navigateByUrl('/home');
              }
            });
          } else {
            this.separarArrayPorAlumno(this.csvRecords);

          }
        }).catch(error => {
          console.log('ERROR AL ACCEDER A BD: ', error);
        });
      }
    }
  }



  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {
        console.log('Result', result);
        this.csvRecords = result;
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }

  separarArrayPorAlumno(array: IAsistencia[]): void {
    const nuevoObjeto = {};
    array.forEach( x => {
      if ( !nuevoObjeto.hasOwnProperty(x.name)){
        nuevoObjeto[x.name] = {
          asistencias: [],
          nombre: x.name
        };
      }

      nuevoObjeto[x.name].asistencias.push( x );
    });

    /* const arrayAux = Object.values(nuevoObjeto);
    arrayAux.forEach( aux => {
      aux.asistenciaTotalOnline = []
    }) */

    console.log('nuevoObjeto: ', Object.values(nuevoObjeto));
    this.asistenciasOrdenadasPorAlumno = Object.values(nuevoObjeto);
    this.asistenciasOrdenadasPorAlumno.sort((nota1, nota2) => {
      if (nota1.nombre > nota2.nombre) { //comparación lexicogŕafica
        return 1;
      } else if (nota1.nombre < nota2.nombre) {
        return -1;
      }
      return 0;
    });

  }

  calcularPorcentajes(esOnline: boolean, array: any): string {
    let asistenciaOnline = 0;
    let asistenciaPresencial = 0;
    array.forEach(asistencia => {
      if (asistencia.tipoAsistencia === undefined || asistencia.tipoAsistencia === null) {
        console.log('ASISTENCIA PRESENCIAL: ', asistencia);
        if ( asistencia.asiste ) {
          asistenciaPresencial++;
        }
      } else {
        console.log('ASISTENCIA ONLINE: ', asistencia);
        if ( asistencia.valida ) {
          asistenciaOnline++;
        }
      }
    });
    if (esOnline) {
      if ( this.numClasesActualesOnline > 0) {
        return parseFloat(((asistenciaOnline * 100) / this.numClasesActualesOnline).toString()).toFixed(2);
      } else {
        return '0';
      }
    } else {
      if ( this.numClasesActualesPresenciales > 0) {
        return parseFloat(((asistenciaPresencial * 100) / this.numClasesActualesPresenciales).toString()).toFixed(2);
      } else {
        return '0';
      }
    }
  }

  calcularPorcentajeTotal(array: any): string {
    let asistenciaOnline = 0;
    let asistenciaPresencial = 0;
    array.forEach(asistencia => {
      if (asistencia.tipoAsistencia === undefined || asistencia.tipoAsistencia === null) {
        if ( asistencia.asiste ) {
          asistenciaPresencial++;
        }
      } else {
        if ( asistencia.valida ) {
          asistenciaOnline++;
        }
      }
    });
    const clasesTotales = this.numClasesActualesOnline + this.numClasesActualesPresenciales;
    const numAsistenciasTotales = asistenciaOnline + asistenciaPresencial;
    const asistenciaTotal = parseFloat(((numAsistenciasTotales * 100) / clasesTotales).toString()).toFixed(2);
    return asistenciaTotal;

  }

  exportElmToExcel(): void {
    // tslint:disable-next-line: max-line-length
    this.utilidadesService.exportTableElmToExcel(this.userTable, 'AsistenciaTotal_' + this.claseSeleccionada + '_' + this.usuarioService.usuario.facultad);
  }

}
