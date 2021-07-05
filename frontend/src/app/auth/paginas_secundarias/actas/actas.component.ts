import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxCsvParser, NgxCSVParserError } from 'projects/ngx-csv-parser/src/public-api';
import { IAsistenciaOnline, AddAsistencia } from 'src/app/models/asistenciaOnline';
import { IAsistencia } from 'src/app/models/asistenciaPresencial';
import { Notas } from 'src/app/models/notas';
import { AsistenciaOnlServiceService } from 'src/app/services/asistencia-onl-service.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { AsistenciaPresencialService } from '../../../services/asistencia-presencial-service.service';
import { NotasService } from '../../../services/notas.service';
import { UtilidadesService } from '../../../services/utilidades.service';

@Component({
  selector: 'app-actas',
  templateUrl: './actas.component.html',
  styleUrls: ['./actas.component.css']
})
export class ActasComponent implements OnInit {

  claseSeleccionada: string;
  csvRecords: any[] = [];
  arrayNotas: Notas[] = [];
  isBonificacionCalculada = false;
  header = false;
  arrayBD: IAsistencia[];
  asistenciasOrdenadasPorAlumno: any[] = [];
  numClasesActualesOnline = 0;
  numClasesActualesPresenciales = 0;
  numeroUltimaNota: number;
  isNotasYaGuardadas = false;

  @ViewChild('fileImportInput', {static: false}) fileImportInput: any;
  @ViewChild('tablaActas') userTable: ElementRef;


  constructor(private ngxCsvParser: NgxCsvParser,
              private asistenciaOnlineService: AsistenciaOnlServiceService,
              private usuarioService: AuthService,
              private router: Router,
              private asistenciaPresencialService: AsistenciaPresencialService,
              private notasService: NotasService,
              private utilidadesService: UtilidadesService) {
  }

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
              '2-NTR-6': 'Nutrigenómica'
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
              '4-TXC-4,5': 'Toxicología Clínica'  
            },
            'FARMACIA': {
              '1-FPT-6': 'Fisiopatología',
              '2-FYF-4,5': 'Farmacognosia y Fitoterapia'
            },
            'FISIOTERAPIA': {
              '1–FPS-4,5': 'Farmacología para Fisioterapeutas',
              '2-CNS-6': 'Cinesiterapia',
              '3-BLG-6': 'Biología Humana',
              '4-VFN-4,5': 'Vendajes Funcionales y Neuromusculares'
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
        console.log('CLASE SELECCIONADA: ', this.claseSeleccionada);
        const claseAsistencia: AddAsistencia = {
          nombreClase: this.claseSeleccionada,
          facultad: this.usuarioService.usuario.facultad
        };
        await this.asistenciaOnlineService.getAsistenciaClase(claseAsistencia).then(resp => {
          console.log('respssss: ', resp);
          if (resp.ok.toString() === 'true') {
            this.numClasesActualesOnline = parseInt(resp.numeroClasesOnline, 10);
            this.numClasesActualesPresenciales = parseInt(resp.numeroClasesPresenciales, 10);
          }
        });

        await this.notasService.getNotasBD(claseAsistencia).then( resp => {
          console.log('resp: ', resp);
          if ( resp.lista.length === 0) {
            this.numeroUltimaNota = 0;
          } else {
            const ultimaNotaGuardada = resp.lista[0];
            this.numeroUltimaNota = resp.lista[0].numeroUltimaNota;
            for (const nota of resp.lista  ) {
              if (nota.numeroUltimaNota === ultimaNotaGuardada.numeroUltimaNota) {
                this.arrayNotas.push(nota);
              } else {
                this.isBonificacionCalculada = true;
                this.isNotasYaGuardadas = true;
                break;
              }
            }
            // tslint:disable-next-line: typedef
            this.arrayNotas.sort((nota1, nota2) => {
              if (nota1.nombre > nota2.nombre) { //comparación lexicogŕafica
                return 1;
              } else if (nota1.nombre < nota2.nombre) {
                return -1;
              }
              return 0;
            });
          }

        }).catch(error => {
          console.log('ERROR: ', error);
        });
      }
      }




  }




  fileChangeListener($event: any): void {
    this.isNotasYaGuardadas = false;
    const files = $event.srcElement.files;
    // this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {
        console.log('Result', result);
        if (result[0][0].split(';')[0].toString().toUpperCase() === 'NOMBRE Y APELLIDOS') {
          this.arrayNotas = [];
          this.isBonificacionCalculada = false;
          result.shift();
          this.csvRecords = result;
          console.log('Result 11', this.csvRecords);
          this.csvRecords.forEach(element => {
            console.log('Result 1', element[0]);
            const array = element[0].split(';');
            const notaAlumno: Notas = {
              aplica: false,
              nombre: array[0],
              notaOrdinaria: array[1],
              notaExtraordinaria: array[2],
              asistenciaTotal: 0,
              notaFinalExtraordinaria: array[2],
              notaFinalOrdinaria: array[1],
              clase: this.claseSeleccionada,
              fechaNota: new Date(),
              numeroUltimaNota: this.numeroUltimaNota + 1
            };
            this.arrayNotas.push(notaAlumno);
          });
          this.arrayNotas.sort((nota1, nota2) => {
            if (nota1.nombre > nota2.nombre) { //comparación lexicogŕafica
              return 1;
            } else if (nota1.nombre < nota2.nombre) {
              return -1;
            }
            return 0;
          });
          console.log('Result 2', this.arrayNotas);
        } else {
          this.arrayNotas = [];
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las cabeceras no coiniciden con el .csv esperado!',
            footer: 'Pruebe de nuevo, por favor.'
          });
        }


      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe de seleccionar una archivo .csv!',
          footer: 'Pruebe de nuevo, por favor.'
        });
      });
  }

  guardarDatos(): void {

    this.notasService.guardarArrayNotasBD(this.arrayNotas).then(resp => {
      console.log('respuesta bd: ', resp);
      this.csvRecords = [];
      this.arrayNotas = [];
      this.isBonificacionCalculada = false;
      Swal.fire('¡Perfecto!', 'Actas guardadas correctamente.', 'success');
    }).catch(error => {
      console.log('ERROR: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar la base de datos!',
        footer: 'Pruebe de nuevo, por favor.'
      });
    });

  }

  validarTiempoEnClase(tiempo: string): boolean {
    const aux = tiempo.split(':');
    const horas = parseInt(aux[0], 10);
    const minutos = parseInt(aux[1], 10);
    const segundos = parseInt(aux[2], 10);
    if (horas > 0) {
      return true;
    } else {
      if ( minutos >= 45){
        return true;
      } else {
        return false;
      }
    }

  }

  async calcularBonificacion(): Promise<void> {
    console.log('maximooooo: ', this.arrayNotas[2]);
    console.log('maximooooo2: ', this.arrayNotas[2].bonificacion === undefined);
    await this.asistenciaPresencialService.listarAsistenciasTotales(this.claseSeleccionada).then( resp => {
      console.log('resp BD: ', resp);
      this.arrayBD = resp.lista;
      if (this.arrayBD.length === 0) {
        Swal.fire({
          title: 'Error!',
          text: '¡Primero cargue la asistencia de los alumnos!',
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
        this.separarArrayPorAlumno(this.arrayBD);

      }
    }).catch(error => {
      console.log('ERROR AL ACCEDER A BD: ', error);
    });
    this.isBonificacionCalculada = true;
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
    console.log('nuevoObjeto: ', Object.values(nuevoObjeto));
    this.asistenciasOrdenadasPorAlumno = Object.values(nuevoObjeto);
    this.calcularPorcentajeTotal(this.asistenciasOrdenadasPorAlumno);
    console.log('this.array: ', this.arrayNotas);
  }

  calcularPorcentajeTotal(array: any): void {

    const clasesTotales = this.numClasesActualesOnline + this.numClasesActualesPresenciales;
    console.log('clases totales: ', clasesTotales);

    array.forEach(alumno => {
      let asistenciaOnline = 0;
      let asistenciaPresencial = 0;
      console.log(alumno.nombre);

      alumno.asistencias.forEach(asistencia => {
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

      const numAsistenciasTotales = asistenciaOnline + asistenciaPresencial;
      const asistenciaTotal = parseFloat(((numAsistenciasTotales * 100) / clasesTotales ).toString()).toFixed(2);
      const porcentajeAsistencia = parseInt(asistenciaTotal, 10);
      let bonificacion = 0;
      switch (true) {
        case ((porcentajeAsistencia > 69) && (porcentajeAsistencia < 86)):
          bonificacion = 0.5;
          break;
        case (porcentajeAsistencia > 85):
          bonificacion = 1;
          break;
        default:
          bonificacion = 0;
          break;
      }
      this.arrayNotas.map((alum) => {
        if ( alum.nombre.toUpperCase() === alumno.nombre.toUpperCase()){
          alum.bonificacion = bonificacion;
          alum.asistenciaTotal = parseFloat(asistenciaTotal);
        }
      });
    });
  }

  aplicarBonificacion(aplica: boolean, i: number): void {
    console.log('aplica: ', aplica);
    console.log('i: ', i);
    console.log('arrayNotas: ', this.arrayNotas[i]);


    if ( aplica ) {
      if (this.arrayNotas[i].aplica !== undefined && this.arrayNotas[i].aplica === false){
        if (this.arrayNotas[i].notaOrdinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            this.arrayNotas[i].notaFinalOrdinaria = parseFloat(this.arrayNotas[i].notaOrdinaria) + this.arrayNotas[i].bonificacion;
          }
        } else {
          this.arrayNotas[i].notaFinalOrdinaria = 0;
        }

        if (this.arrayNotas[i].notaExtraordinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            // tslint:disable-next-line: max-line-length
            this.arrayNotas[i].notaFinalExtraordinaria = parseFloat(this.arrayNotas[i].notaExtraordinaria) + this.arrayNotas[i].bonificacion;
          }
        } else {
          this.arrayNotas[i].notaFinalExtraordinaria = 0;
        }
      } else if (this.arrayNotas[i].aplica !== undefined) {
        if (this.arrayNotas[i].notaOrdinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            this.arrayNotas[i].notaFinalOrdinaria = parseFloat(this.arrayNotas[i].notaOrdinaria) + this.arrayNotas[i].bonificacion;
          }
        } else {
          this.arrayNotas[i].notaFinalOrdinaria = 0;
        }

        if (this.arrayNotas[i].notaExtraordinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            // tslint:disable-next-line: max-line-length
            this.arrayNotas[i].notaFinalExtraordinaria = parseFloat(this.arrayNotas[i].notaExtraordinaria) + this.arrayNotas[i].bonificacion;
          }
        } else {
          this.arrayNotas[i].notaFinalExtraordinaria = 0;
        }
      }
    } else {
      if (this.arrayNotas[i].aplica !== undefined && this.arrayNotas[i].aplica === true){
        if (this.arrayNotas[i].notaOrdinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            // tslint:disable-next-line: max-line-length
            this.arrayNotas[i].notaFinalOrdinaria = parseFloat(this.arrayNotas[i].notaOrdinaria);
          }
        } else {
          this.arrayNotas[i].notaFinalOrdinaria = 0;
        }

        if (this.arrayNotas[i].notaExtraordinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            // tslint:disable-next-line: max-line-length
            this.arrayNotas[i].notaFinalExtraordinaria = parseFloat(this.arrayNotas[i].notaExtraordinaria);
          }
        } else {
          this.arrayNotas[i].notaFinalExtraordinaria = 0;
        }
      } else if (this.arrayNotas[i].aplica !== undefined) {
        if (this.arrayNotas[i].notaOrdinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            this.arrayNotas[i].notaFinalOrdinaria = parseFloat(this.arrayNotas[i].notaOrdinaria);
          }
        } else {
          this.arrayNotas[i].notaFinalOrdinaria = 0;
        }

        if (this.arrayNotas[i].notaExtraordinaria !== '') {
          if (this.arrayNotas[i].bonificacion !== undefined) {
            // tslint:disable-next-line: max-line-length
            this.arrayNotas[i].notaFinalExtraordinaria = parseFloat(this.arrayNotas[i].notaExtraordinaria);
          }
        } else {
          this.arrayNotas[i].notaFinalExtraordinaria = 0;
        }
      }
    }
    this.arrayNotas[i].aplica = aplica;
    console.log(this.arrayNotas[i]);
  }

  exportElmToExcel(): void {
    // tslint:disable-next-line: max-line-length
    this.utilidadesService.exportTableElmToExcel(this.userTable, 'Actas_' + this.claseSeleccionada + '_' + this.usuarioService.usuario.facultad);
  }


}
