import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgxCsvParser } from 'projects/ngx-csv-parser/src/public-api';
import { NgxCSVParserError } from 'projects/ngx-csv-parser/src/public-api';
import { AsistenciaPresencialService } from '../../../services/asistencia-presencial-service.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { IAsistencia } from 'src/app/models/asistenciaPresencial';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
import { AddAsistencia, IAsistenciaOnline } from 'src/app/models/asistenciaOnline';
import { AsistenciaOnlServiceService } from '../../../services/asistencia-onl-service.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  @ViewChild('fileImportInput') fileImportInput: any;
  csvRecords: string[] = [];
  listaAlumnos: IAsistencia[] = [];
  header = false;
  claseSeleccionada: string;

  constructor(private ngxCsvParser: NgxCsvParser,
              private asistenciaPresencialService: AsistenciaPresencialService,
              private asistenciaOnlineService: AsistenciaOnlServiceService,
              private usuarioService: AuthService,
              private router: Router) {
  }

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
        inputPlaceholder: 'Seleccione una asignatura',
        inputValidator: (value) => {
          console.log('VALUE: ', value);
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
        await this.asistenciaPresencialService.listarAlumnosBD(this.claseSeleccionada).then( resp => {
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
            this.csvRecords.forEach(element => {
              const alumno: IAsistencia = {
                name: element
              };
              this.listaAlumnos.push(alumno);
            });
            console.log('lISTA ALUMNOS: ', this.listaAlumnos);
          }
        }).catch(error => {
          console.log('ERROR AL ACCEDER A BD: ', error);
        });
      }
    }


  }
  marcarAsistencia(asistencia: boolean, alumno: any): void {
    if (asistencia) {
      this.listaAlumnos[alumno].asiste = true;
    } else {
      this.listaAlumnos[alumno].asiste = false;
    }
    console.log('csv: ', this.listaAlumnos);
  }

  guardarAsistenciaBD(): void {
    let todoOk = true;
    let contadorAsistencias = 0;
    this.listaAlumnos.forEach(element => {
      if (element.asiste !== undefined && element.asiste !== null) {
        const user: IAsistenciaOnline = {
          name: element.name,
          role: element.role,
          fechaEntrada: moment().locale('es').format().toString(),
          clase: this.claseSeleccionada,
          asiste: element.asiste,
          valida: element.asiste
        };
        contadorAsistencias++;
        if (element.asiste) {

          this.asistenciaPresencialService.marcarAsistencia(user, true).then( resp => {
            console.log('Respuesta BD: ', resp);
          }).catch(error => {
            console.log('ERROR BD GUARDAR ASISTENCIA: ', error);
            todoOk = false;
          });
        } else {
          this.asistenciaPresencialService.marcarAsistencia(user, false).then( resp => {
            console.log('Respuesta BD: ', resp);
          }).catch(error => {
            console.log('ERROR BD GUARDAR ASISTENCIA: ', error);
            todoOk = false;
          });

        }
      }
    });

    if ( todoOk ) {
      const clase: AddAsistencia = {
        nombreClase: this.claseSeleccionada,
        facultad: this.usuarioService.usuario.facultad,
        esAsistenciaOnline: false
      };
      this.asistenciaOnlineService.addAsistenciaClase(clase).then(resp => {
        Swal.fire('¡Perfecto!', 'Asistencia guardada correctamente de ' + contadorAsistencias + ' alumnos.', 'success');
      }).catch(error => {
        console.log('ERROR: ', error);
      });

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar la base de datos!',
        footer: 'Pruebe de nuevo, por favor.'
      });
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


  async cambiarClase(): Promise<void> {
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
            this.claseSeleccionada = value;
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

      await this.asistenciaPresencialService.listarAlumnosBD(this.claseSeleccionada).then( resp => {
        this.csvRecords = [];
        console.log('resp BD: ', resp);
        this.csvRecords = resp.lista;
        if (this.csvRecords.length === 0) {
          this.listaAlumnos = [];
          Swal.fire({
            title: 'Error!',
            text: '¡No hay alumnos de esta clase previamente cargados!',
            icon: 'error',
            confirmButtonText: 'Vale',
            allowOutsideClick: false
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below
            if (result.isConfirmed) {
              this.router.navigateByUrl('/inicio');
            } */
          });
        } else {
          this.listaAlumnos = [];
          this.csvRecords.forEach(element => {
            const alumno: IAsistencia = {
              name: element
            };
            this.listaAlumnos.push(alumno);
          });
          console.log('lISTA ALUMNOS: ', this.listaAlumnos);
        }
      }).catch(error => {
        console.log('ERROR AL ACCEDER A BD: ', error);
      });
    }
  }


}
