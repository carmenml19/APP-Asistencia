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

      let clase: any;
      if (this.usuarioService.usuario.facultad.toString().toUpperCase() === 'INFORMATICA') {
        clase = await Swal.fire({
          title: 'Clases',
          input: 'select',
          allowOutsideClick: false,
          showCancelButton: true,
          inputOptions: {
            'INGENIERÍA INFORMÁTICA': {
              '1-SSO-6': 'Sistemas Operativos',
              '2-PVA-6': 'Programación Visual Avanzada',
              '3-RCS-6': 'Redes de Computadores', 
              '4–PGP-4,5': 'Programación Paralela' 
            },
            'ARQUITECTURA': {
              '1-EGI-6': 'Economía y Gestión Inmobiliaria',
              '2-FYF-4,5': 'Arquitectura Sostenible'
            },
            'BIOTECNOLOGÍA': {
              '1–BQM-4,5': 'Bioquímica Metabólica',
              '2-NTR-6': 'Nutrigenómica',
            }
          },
          inputPlaceholder: 'Seleccione una clase',
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value !== '') {
                this.claseSeleccionada = value;
                resolve(null);
              } else {
                resolve('Necesita seleccionar una clase!');
              }
            });
          }
        });
      } else {
        clase = await Swal.fire({
          title: 'Clases',
          input: 'select',
          allowOutsideClick: false,
          showCancelButton: true,
          inputOptions: {
            'MEDICINA': {
              '1-EMB-6': 'Embriología Humana',
              '2-OTO-4,5': 'Otorrinolaringología',
              '4-TXC-4,5': 'Toxicología Clínica',  
            },
            'FARMACIA': {
              '1-FPT-6': 'Fisiopatología',
              '2-FYF-4,5': 'Farmacognosia y Fitoterapia',
            },
            'FISIOTERAPIA': {
              '1–FPS-4,5': 'Farmacología para Fisioterapeutas',
              '2-CNS-6': 'Cinesiterapia',
              '3-BLG-6': 'Biología Humana',
              '4-VFN-4,5': 'Vendajes Funcionales y Neuromusculares',
            }
          },
          inputPlaceholder: 'Seleccione una clase',
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value !== '') {
                this.claseSeleccionada = value;
                resolve(null);
              } else {
                resolve('Necesita seleccionar una clase!');
              }
            });
          }
        });
      }
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
